import express from "express";
import cors from "cors";
import answerRoutes from "./routes/answerRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static("public/images"));
app.use("/api/answers", answerRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/feedback", feedbackRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
