import { fetchQuizzes } from "./quizCreator.js";

function showQuizTitle($titleEl, $index, $quiz) {
  $titleEl.textContent = `Quiz ${$index + 1}: ${$quiz.title}`;
}

function extractBaseTitle(title) {
  return title.replace(/\s*-\s*[A-Z]{2}$/, "").trim();
}

async function displayQuizzesAdminPanel() {
  try {
    const quizzes = await fetchQuizzes();

    const container = document.querySelector("#quiz-list"); // fixed the ID
    container.innerHTML = "";

    // Step 1: Group quizzes by group_id
    const grouped = quizzes.reduce((acc, quiz) => {
      const key = quiz.group_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(quiz);
      return acc;
    }, {});

    // Step 2: Display grouped quizzes
    let groupIndex = 0;
    for (const groupId in grouped) {
      groupIndex++;
      const group = grouped[groupId];
      const baseTitle = extractBaseTitle(group[0].title);

      // Create a container for each quiz group
      const groupContainer = document.createElement("div");
      groupContainer.className = "quiz-group";

      // Group Title: Quiz 1: dolfijnen
      const groupTitle = document.createElement("h3");
      groupTitle.textContent = `Quiz ${groupIndex}: ${baseTitle}`;
      groupContainer.appendChild(groupTitle);

      // Add each quiz variant (NL, EN, FR...)

// 👉 Add this AFTER the forEach — to only trigger on group title
groupTitle.addEventListener("click", () => {
  const popOver = document.querySelector("#admin-password-popover");
  if (popOver) popOver.style.display = "flex";
});

      container.appendChild(groupContainer);
    }

    // Close popover logic
    const popOver = document.querySelector("#admin-password-popover");
    const closeBtn = document.querySelector(".admin-popover__close");
    if (closeBtn && popOver) {
      closeBtn.addEventListener("click", () => {
        popOver.style.display = "none";
      });
    }
  } catch (error) {
    console.error("Fout bij ophalen of tonen van quizzes:", error);
  }
}

document.addEventListener('DOMContentLoaded',() => {    
    displayQuizzesAdminPanel();
})