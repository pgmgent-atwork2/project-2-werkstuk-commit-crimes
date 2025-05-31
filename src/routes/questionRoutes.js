import express from 'express';
const router = express.Router();
import * as questionController from '../controllers/QuestionsController.js';

router.get('/', questionController.getAllQuestions);
router.post('/', questionController.postQuestion);


router.patch('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

export default router;