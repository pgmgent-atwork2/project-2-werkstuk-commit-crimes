function extractBaseTitle(title) {
  if (!title) return "Unknown Quiz";
  return title.replace(/\s*-\s*[A-Z]{2}$/, "").trim();
}

async function loadSessions() {
  try {
    const response = await fetch("http://localhost:3000/api/sessions");
    if (!response.ok) {
      alert("Failed to load sessions");
      return;
    }
    const sessions = await response.json();

    const container = document.getElementById("sessions-container");
    container.innerHTML = "";

    const quizResponse = await fetch("http://localhost:3000/api/quiz");
    const quizzes = quizResponse.ok ? await quizResponse.json() : [];

    let currentOpenDropdown = null;

    sessions.forEach((session) => {

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";

      const sessionQuizzes = session.groupQuizzes || 
                           [session.quiz].filter(Boolean) || 
                           quizzes.filter(q => q.group_id === session.group);
      
      const primaryQuiz = sessionQuizzes.length > 0 ? sessionQuizzes[0] : null;
      const mainButtonText = primaryQuiz ? extractBaseTitle(primaryQuiz.title) : `Session ${session.id}`;
      
      const sessionBtn = document.createElement("button");
      sessionBtn.className = "session-button";
      sessionBtn.textContent = mainButtonText;
      
      const dropdownContent = document.createElement("div");
      dropdownContent.className = "dropdown-content";
      dropdownContent.style.display = "none";
      
      if (sessionQuizzes.length > 0) {
        sessionQuizzes.forEach(quiz => {
          const quizBtn = document.createElement("button");
          quizBtn.className = "quiz-button";
          quizBtn.textContent = quiz.title;
          quizBtn.addEventListener("click", () => {
            window.location.href = `/quiz-nl.html?session_id=${session.id}&quiz_id=${quiz.id}`;
          });
          dropdownContent.appendChild(quizBtn);
        });
      } else {
        const noQuizMsg = document.createElement("p");
        noQuizMsg.textContent = "No quizzes available";
        dropdownContent.appendChild(noQuizMsg);
      }
      
      sessionBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (currentOpenDropdown && currentOpenDropdown !== dropdownContent) {
          currentOpenDropdown.style.display = "none";
        }
        
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
          currentOpenDropdown = null;
        } else {
          dropdownContent.style.display = "block";
          currentOpenDropdown = dropdownContent;
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

document.addEventListener('DOMContentLoaded', () => {    
    loadSessions();
});