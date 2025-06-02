import express from "express";
const router = express.Router();
import * as quizController from "../controllers/QuizController.js";

router.get("/", quizController.getAllQuizes);
router.post("/", quizController.createQuiz);
router.patch("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);

export default router;
