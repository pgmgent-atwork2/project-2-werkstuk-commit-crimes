import express from "express";
const router = express.Router();
import * as sessionController from "../controllers/SessionController.js"

router.get("/", sessionController.getAllSessions);
router.post('/', sessionController.createSession);

router.get("/latest", sessionController.getActiveSessions);

export default router;