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

document.addEventListener("DOMContentLoaded", () => {
  addUsers();
});

