import express from 'express';
import * as questionController from '../controllers/QuestionsController.js';
import upload from '../middleware/upload-images.js';

const router = express.Router();

router.get('/', questionController.getAllQuestions);

router.patch('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

router.post('/', upload.single('image'), questionController.postQuestion);

export default router;