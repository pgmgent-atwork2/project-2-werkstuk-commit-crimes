async function loadSessions() {
  try {
    const response = await fetch('/api/sessions');
    if (!response.ok) {
      alert("Kon sessies niet laden");
      return;
    }
    const sessions = await response.json();

    const container = document.getElementById('sessions-container');
    container.innerHTML = '';

    sessions.forEach(session => {
      const btn = document.createElement('button');
      btn.textContent = `Sessie ${session.id} (Quiz ${session.quiz_id})`;
      btn.addEventListener('click', () => {

        window.location.href = `/quiz.html?session_id=${session.id}`;
      });
      container.appendChild(btn);
    });
  } catch (error) {
    console.error(error);
    alert("Er is iets misgegaan bij het laden van sessies");
  }
}

export default loadSessions