async function loadSessions() {
  try {
    const response = await fetch("http://localhost:3000/api/sessions");
    if (!response.ok) {
      alert("Kon sessies niet laden");
      return;
    }
    const sessions = await response.json();

    const container = document.getElementById("sessions-container");
    container.innerHTML = "";

    const quizResponse = await fetch("http://localhost:3000/api/quiz");
    const quizzes = quizResponse.ok ? await quizResponse.json() : [];

    sessions.forEach((session) => {
      const quiz = quizzes.find((q) => q.id === session.quiz_id);
      const quizTitle = quiz ? quiz.title : `Quiz ${session.quiz_id}`;

      const btn = document.createElement("button");
      btn.textContent = `Sessie ${session.id} (${quizTitle})`;
      btn.addEventListener("click", () => {
        window.location.href = `/quiz-nl.html?session_id=${session.id}&quiz_id=${session.quiz_id}`;
      });
      container.appendChild(btn);
    });
  } catch (error) {
    console.error(error);
    alert("Er is iets misgegaan bij het laden van sessies");
  }
}

export default loadSessions;
