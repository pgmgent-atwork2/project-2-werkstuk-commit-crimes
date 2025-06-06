import express from 'express';
const router = express.Router();
import * as feedbackController from '../controllers/FeedbackController.js';

router.get('/', feedbackController.getAllFeedback);

export default router;