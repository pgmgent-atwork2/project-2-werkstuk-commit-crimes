import express from "express";
const router = express.Router();
import * as userController from "../controllers/UserController.js";

router.get("/", userController.getAllUsers);

router.post("/api/users", userController.registerUser);

export default router;