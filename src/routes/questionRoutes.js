import express from 'express';
const router = express.Router();
import * as questionController from '../controllers/QuestionsController.js';

router.get('/', questionController.getAllQuestions);
router.post('/', questionController.postQuestion);

export default router;