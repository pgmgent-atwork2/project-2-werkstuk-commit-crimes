import express from "express";
const router = express.Router();
import * as userController from "../controllers/UserController.js";

router.get("/", userController.getAllUsers);

router.post("/", userController.registerUser);

router.patch("/update-session", userController.updateUserSession);

router.post("/api/save-score", userController.saveScore);

export default router;