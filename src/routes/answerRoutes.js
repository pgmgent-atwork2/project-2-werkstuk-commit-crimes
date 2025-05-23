import express from 'express';
const router = express.Router();
import * as answerController from '../controllers/AnswerController.js';

router.get('/', answerController.getAllAnswers);

export default router;