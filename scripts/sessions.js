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

    sessions.forEach((session) => {
      // Create dropdown container
      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";
      
      // Create session button
      const sessionBtn = document.createElement("button");
      sessionBtn.className = "session-button";
      sessionBtn.textContent = `Session ${session.id}`;
      
      // Create dropdown content
      const dropdownContent = document.createElement("div");
      dropdownContent.className = "dropdown-content";
      
      // Find quizzes for this session
      const sessionQuizzes = session.groupQuizzes || 
                           [session.quiz].filter(Boolean) || 
                           quizzes.filter(q => q.group_id === session.group);
      
      // Add quizzes to dropdown
      if (sessionQuizzes.length > 0) {
        sessionQuizzes.forEach(quiz => {
          const quizBtn = document.createElement("button");
          quizBtn.className = "quiz-button";
          quizBtn.textContent = extractBaseTitle(quiz.title);
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
      
      // Toggle dropdown on click
      sessionBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle("show");
      });
      
      // Close dropdown when clicking elsewhere
      document.addEventListener("click", () => {
        dropdownContent.classList.remove("show");
      });
      
      dropdown.appendChild(sessionBtn);
      dropdown.appendChild(dropdownContent);
      container.appendChild(dropdown);
    });
  } catch (error) {
    console.error("Error loading sessions:", error);
    alert("Something went wrong while loading sessions");
  }
}

document.addEventListener('DOMContentLoaded', () => {    
    loadSessions();
});