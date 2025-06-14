function addUsers() {
  const registrationForm = document.querySelector(".registration-form");
  if (!registrationForm) return;

  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(registrationForm);
    const name = formData.get("name");
    const day = formData.get("day");
    const month = formData.get("month");
    const year = formData.get("year");

    const language = formData.get("language") || getLanguageFromUrl() || "nl";

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ name, day, month, year, language }),
      });

      if (response.ok) {
        window.location.href = "/sessions.html";
      } else {
        alert("Gebruiker kon niet aangemaakt worden");
      }
    } catch (err) {
      alert("Er is een fout opgetreden");
    }
  });
}

function getLanguageFromUrl() {
  const path = window.location.pathname;
  if (path.includes("-fr")) return "fr";
  if (path.includes("-en")) return "en";
  return "nl";
}

async function loadUsers() {
  const userListElement = document.getElementById("user-list");
  const userListContainer = document.querySelector(".user-list-container");
  if (!userListElement || !userListContainer) return;

  try {
    const sessionRes = await fetch("/api/sessions/latest");
    if (!sessionRes.ok) throw new Error("Geen sessie gevonden");
    const session = await sessionRes.json();

    const createdAt = new Date(session.created_at);
    const now = new Date();
    const diffInMinutes = (now - createdAt) / 1000 / 60;

    if (diffInMinutes < 30) {
      userListElement.innerHTML = "<li>Gebruikers worden pas getoond na 30 minuten.</li>";
      return;
    }


    userListContainer.style.display = "block";

    const usersRes = await fetch(`/api/users?session_id=${session.id}`);
    if (!usersRes.ok) throw new Error("Kan gebruikers niet ophalen");
    const users = await usersRes.json();

    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user.name;
      userListElement.appendChild(li);
    });
  } catch (err) {
    console.error("Fout bij ophalen van gebruikers of sessie:", err);
    const li = document.createElement("li");
    li.textContent = "Kan gebruikers niet ophalen.";
    userListElement.appendChild(li);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  addUsers();
  loadUsers();
});
