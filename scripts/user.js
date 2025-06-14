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
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ name, day, month, year, language }),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;

        if (user && user.id) {
          window.location.href = `/sessions.html?user_id=${user.id}`;
        } else {
          alert("Gebruiker aangemaakt, maar geen ID ontvangen.");
        }
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
    const sessionsRes = await fetch(
      "http://localhost:3000/api/sessions/active"
    );
    if (!sessionsRes.ok) throw new Error("Kan sessies niet ophalen");
    const sessions = await sessionsRes.json();

    if (sessions.length === 0) {
      userListContainer.style.display = "none";
      return;
    }

    userListContainer.style.display = "block";

    for (const session of sessions) {
      const usersRes = await fetch(
        `http://localhost:3000/api/sessions/${session.id}/users`
      );
      if (!usersRes.ok) {
        console.warn(`Kan gebruikers voor sessie ${session.id} niet ophalen`);
        continue;
      }
      const users = await usersRes.json();

      users.forEach((user) => {
        const li = document.createElement("li");

        const button = document.createElement("button");
        button.textContent = user.name;
        button.classList.add("user-button");
        button.addEventListener("click", () => {
          window.location.href = `/sessions.html?user_id=${user.id}`;
        });

        li.appendChild(button);
        userListElement.appendChild(li);
      });
    }
  } catch (err) {
    console.error("Fout bij ophalen van gebruikers:", err);
    const li = document.createElement("li");
    li.textContent = "Kan gebruikers niet ophalen.";
    userListElement.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  addUsers();
  loadUsers();
});
