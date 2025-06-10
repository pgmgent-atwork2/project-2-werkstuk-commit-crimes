import { fetchQuizzes } from "./quizCreator.js";

function showQuizTitle($titleEl, $index, $quiz) {
  $titleEl.textContent = `Quiz ${$index + 1}: ${$quiz.title}`;
}

async function displayQuizzes() {
  try {
    const $quizzes = await fetchQuizzes();

    const $container = document.querySelector("#admin-quiz-list");
    $container.innerHTML = "";

    $quizzes.forEach(($quiz, $index) => {
      const $btn = document.createElement("button");
      $btn.className = "admin__quiz__btn";
      const $titleEl = document.createElement("h3");
      showQuizTitle($titleEl, $index, $quiz);
      $btn.appendChild($titleEl);

      $btn.addEventListener("click", (e) => {
        e.preventDefault();
        const $popOver = document.querySelector("#admin-password-popover");
        if ($popOver) $popOver.style.display = "flex";
      });

      $container.appendChild($btn);
    });

    const $popOver = document.querySelector("#admin-password-popover");
    const $closeBtn = document.querySelector(".admin-popover__close");
    if ($closeBtn && $popOver) {
      $closeBtn.addEventListener("click", () => {
        $popOver.style.display = "none";
      });
    }
  } catch ($error) {
    console.error("Fout bij ophalen of tonen van quizzes:", $error);
  }
}

export default displayQuizzes;
