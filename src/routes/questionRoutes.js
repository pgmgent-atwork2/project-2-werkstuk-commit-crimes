import express from 'express';
const router = express.Router();
import * as questionController from '../controllers/QuestionsController.js';

router.get('/', questionController.getAllQuestions);

export default router;