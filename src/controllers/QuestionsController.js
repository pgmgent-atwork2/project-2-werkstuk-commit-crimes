import QuestionItem from "../lib/models/QuestionItem.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import path from "path";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const imagesPath = path.join(__dirname, '../../images');
if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export const postQuestion = async (req, res) => {
  try {
    if (!req.body.question_text || !req.body.quiz_id) {
      return res.status(400).json({ 
        error: "question_text and quiz_id are required" 
      });
    }

    const quizId = parseInt(req.body.quiz_id);
    if (isNaN(quizId)) {
      return res.status(400).json({ 
        error: "quiz_id must be a valid integer" 
      });
    }

    let imagePath = null;
    if (req.file) {
      imagePath = './images/' + req.file.filename;
    }

    const newQuestion = await QuestionItem.query().insert({
      question_text: req.body.question_text,
      quiz_id: quizId,
      image_path: imagePath
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    
    if (error.type === 'ModelValidation') {
      return res.status(400).json({ 
        error: "Validation failed",
        details: error.data 
      });
    }
    
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
};

export const postQuestionWithImage = [
  upload.single('image'),
  postQuestion
];

export const index = (req, res) => {
    res.render('layout', {
        title: "Make It Happen",
        body: "index",
    });
};

export const getAllQuestions = async (req, res) => {
  try {
    if (req.query.quiz_id) {
      const questions = await QuestionItem.query()
        .where("quiz_id", req.query.quiz_id)
        .withGraphFetched("answers");
      return res.json(questions);
    }

    const allQuestions = await QuestionItem.query().withGraphFetched("answers");
    res.json(allQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const updated = await QuestionItem.query()
      .patchAndFetchById(req.params.id, {
        question_text: req.body.question_text,
        image_path: req.body.image_path
      });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await QuestionItem.query().deleteById(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};