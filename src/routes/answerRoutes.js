import express from "express";
const router = express.Router();
import * as answerController from "../controllers/AnswerController.js";

router.get("/", answerController.getAllAnswers);

router.post("/", answerController.postAnswer);

router.patch("/:id", answerController.updateAnswer);

router.delete("/:id", answerController.deleteAnswer);

export default router;
