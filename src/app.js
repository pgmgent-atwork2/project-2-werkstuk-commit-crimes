import express from "express";
import cors from "cors";
import session from "express-session";
import answerRoutes from "./routes/answerRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 5,
    },
  })
);

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
  req.session.isAuthenticated = true;
  return res.redirect("/admin-panel.html");
  }

//for debugging
console.log("Email:", email);
console.log("Password:", password);
console.log("Expected Email:", process.env.ADMIN_EMAIL);
console.log("Expected Password:", process.env.ADMIN_PASSWORD);

  return res.status(401).send("Ongeldige login");
});

function requireAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  return res.redirect("/admin-login.html");
}

app.get("/admin-panel.html", requireAuth, (req, res) => {
  res.sendFile("admin-panel.html", { root: "views" });
});
app.use(express.static("views"));
app.use("/styles", express.static("styles"));
app.use("/scripts", express.static("scripts"));
app.use("/videos", express.static("videos"));
app.use("/images", express.static("images"));
app.use("/api/answers", answerRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/`);
});
