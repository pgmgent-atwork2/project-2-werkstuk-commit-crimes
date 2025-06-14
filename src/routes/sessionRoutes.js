import express from "express";
const router = express.Router();
import * as sessionController from "../controllers/SessionController.js"

router.get("/", sessionController.getAllSessions);

router.get("/latest", sessionController.getLatestSession);

export default router;