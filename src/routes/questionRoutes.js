import express from "express";
import * as questionController from "../controllers/QuestionsController.js";

const router = express.Router();

router.get("/", questionController.getAllQuestions);

router.patch("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

router.post("/", questionController.postQuestion);

export default router;
