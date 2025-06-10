import { fetchQuizzes } from "./quizCreator.js";

function showQuizTitle($titleEl, $index, $quiz) {
  $titleEl.textContent = `Quiz ${$index + 1}: ${$quiz.title}`;
}

async function displayQuizzes() {
  try {
    const quizzes = await fetchQuizzes();

    const container = document.querySelector("#admin-quiz-list");

    quizzes.forEach(($quiz, index) => {
      const titleEl = document.createElement("h3");
      showQuizTitle(titleEl, index, $quiz);
      container.appendChild(titleEl);
    });
  } catch (error) {
    console.error("Fout bij ophalen of tonen van quizzes:", error);
  }
}

export default displayQuizzes;
