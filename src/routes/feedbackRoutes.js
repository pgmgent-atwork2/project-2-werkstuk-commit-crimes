import express from 'express';
const router = express.Router();
import * as feedbackController from '../controllers/FeedbackController.js';

router.get('/', feedbackController.getAllFeedback);

router.post('/', feedbackController.postFeedback);

export default router;