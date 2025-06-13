import initQuizzes from "./quizCreator.js";
import displayQuizzes from "./adminPanel.js";
import loadSessions from "./sessions.js";

document.addEventListener("DOMContentLoaded", () => {
  initQuizzes();
  displayQuizzes();
  loadSessions();
});
