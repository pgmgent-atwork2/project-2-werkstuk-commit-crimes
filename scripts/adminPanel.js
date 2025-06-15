async function fetchQuizzes() {
  const $response = await fetch("http://localhost:3000/api/quiz");
  if (!$response.ok) throw new Error("Fout bij ophalen quizzes");
  return await $response.json();
}

function showQuizTitle($titleEl, $index, $quiz) {
  $titleEl.textContent = `Quiz ${$index + 1}: ${$quiz.title}`;
}

function extractBaseTitle(title) {
  return title.replace(/\s*-\s*[A-Z]{2}$/, "").trim();
}

async function displayQuizzesAdminPanel() {
  try {
    const quizzes = await fetchQuizzes();

    const container = document.querySelector("#quiz-list"); 
    container.innerHTML = "";

    const grouped = quizzes.reduce((acc, quiz) => {
      const key = quiz.group_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(quiz);
      return acc;
    }, {});

    let groupIndex = 0;
    for (const groupId in grouped) {
      groupIndex++;
      const group = grouped[groupId];
      const baseTitle = extractBaseTitle(group[0].title);

      const groupContainer = document.createElement("div");
      groupContainer.className = "quiz-group";

      const groupTitle = document.createElement("h3");
      groupTitle.textContent = `Quiz ${groupIndex}: ${baseTitle}`;
      groupContainer.appendChild(groupTitle);

      groupTitle.dataset.groupId = groupId;
      
      groupTitle.addEventListener("click", () => {
        const popOver = document.querySelector("#admin-password-popover");
        if (popOver) {
          popOver.style.display = "flex";

          popOver.dataset.groupId = groupId;
        }
      });

      container.appendChild(groupContainer);
    }

    const popOver = document.querySelector("#admin-password-popover");
    const closeBtn = document.querySelector(".admin-popover__close");
    const passwordForm = document.querySelector("#password-form");

    if (closeBtn && popOver) {
      closeBtn.addEventListener("click", () => {
        popOver.style.display = "none";
      });
    }

    if (passwordForm) {
      passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const passwordInput = document.querySelector("#password-input");
        const password = passwordInput.value;
        const groupId = popOver.dataset.groupId;

        if (!groupId) {
          console.error("No quiz group selected");
          return;
        }

        try {
          const response = await fetch("http://localhost:3000/api/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              group_id: Number(groupId),
              password: password
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create session");
          }

          const sessionData = await response.json();
          console.log("Session created:", sessionData);
          
          popOver.style.display = "none";
          passwordInput.value = "";
          
          alert("Session started successfully!");
          
        } catch (error) {
          console.error("Error creating session:", error);
          alert("Failed to start session. Please try again.");
        }
      });
    }
  } catch (error) {
    console.error("Fout bij ophalen of tonen van quizzes:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {    
    displayQuizzesAdminPanel();
});