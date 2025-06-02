import express from 'express';
const router = express.Router();
import * as quizController from "../controllers/QuizController.js"

router.get("/", quizController.getAllQuizes);
router.patch("/:id", quizController.updateQuiz);

export default router;