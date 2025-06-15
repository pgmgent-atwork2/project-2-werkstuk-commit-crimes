import express from "express";
import * as questionController from "../controllers/QuestionsController.js";

const router = express.Router();

router.get("/", questionController.getAllQuestions);
router.post("/", questionController.postQuestionWithImage);

router.patch("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

export default router;
