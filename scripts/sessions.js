function extractBaseTitle(title) {
  if (!title) return "Unknown Quiz";
  return title.replace(/\s*-\s*[A-Z]{2}$/, "").trim();
}

export function getUserIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user_id");
}

async function loadSessions() {
  try {
    const user_id = getUserIdFromUrl();
    if (!user_id) {
      alert("Geen gebruiker gevonden om sessies te laden.");
      return;
    }

    const response = await fetch("http://localhost:3000/api/sessions");
    if (!response.ok) {
      alert("Failed to load sessions");
      return;
    }
    const sessions = await response.json();

    const container = document.getElementById("sessions-container");
    container.classList.add("sessions-wrapper");
    container.innerHTML = "";

    const quizResponse = await fetch("http://localhost:3000/api/quiz");
    const quizzes = quizResponse.ok ? await quizResponse.json() : [];

    let currentOpenDropdown = null;

    sessions.forEach((session) => {
      const dropdown = document.createElement("div");
      dropdown.className = "dropdown session-dropdown";

      const sessionQuizzes =
        session.groupQuizzes ||
        [session.quiz].filter(Boolean) ||
        quizzes.filter((q) => q.group_id === session.group);

      const primaryQuiz = sessionQuizzes.length > 0 ? sessionQuizzes[0] : null;
      const mainButtonText =
        session.title?.name || primaryQuiz
          ? extractBaseTitle(primaryQuiz.title)
          : `Session ${session.id}`;

      const sessionBtn = document.createElement("button");
      sessionBtn.className = "session-button";
      sessionBtn.textContent = mainButtonText;

      const dropdownContent = document.createElement("div");
      dropdownContent.className = "dropdown-content";
      dropdownContent.style.display = "none";

      if (sessionQuizzes.length > 0) {
        sessionQuizzes.forEach((quiz) => {
          const quizBtn = document.createElement("button");
          quizBtn.className = "quiz-button";
          quizBtn.textContent = quiz.title;
          quizBtn.addEventListener("click", () => {
            const lang = quiz.language || "nl";
            const page = {
              nl: "quiz-nl.html",
              en: "quiz-en.html",
              fr: "quiz-fr.html",
            }[lang] || "quiz-nl.html";

            window.location.href = `/${page}?session_id=${session.id}&quiz_id=${quiz.id}&user_id=${user_id}`;
          });
          dropdownContent.appendChild(quizBtn);
        });
      } else {
        const noQuizMsg = document.createElement("p");
        noQuizMsg.className = "no-quizzes-msg";
        noQuizMsg.textContent = "No quizzes available";
        dropdownContent.appendChild(noQuizMsg);
      }

      sessionBtn.addEventListener("click", async (e) => {
        e.stopPropagation();

        if (currentOpenDropdown && currentOpenDropdown !== dropdownContent) {
          currentOpenDropdown.style.display = "none";
        }

        if (dropdownContent.style.display === "flex") {
          dropdownContent.style.display = "none";
          currentOpenDropdown = null;
        } else {
          dropdownContent.style.display = "flex";
          currentOpenDropdown = dropdownContent;
        }

        try {
          const response = await fetch("http://localhost:3000/api/users/update-session", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: Number(user_id), session_id: session.id }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Session gekoppeld aan user:", data.user);
          } else {
            alert("Kon sessie niet koppelen aan gebruiker.");
          }
        } catch (error) {
          alert("Fout bij koppelen sessie aan gebruiker.");
          console.error(error);
        }
      });

      dropdown.appendChild(sessionBtn);
      dropdown.appendChild(dropdownContent);
      container.appendChild(dropdown);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown")) {
        if (currentOpenDropdown) {
          currentOpenDropdown.style.display = "none";
          currentOpenDropdown = null;
        }
      }
    });
  } catch (error) {
    console.error("Error loading sessions:", error);
    alert("Something went wrong while loading sessions");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadSessions();
});
