document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.querySelector(".registration-form form");
  if (registrationForm) {
    registrationForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(registrationForm);
      const name = formData.get("name");
      const day = formData.get("day");
      const month = formData.get("month");
      const year = formData.get("year");
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ name, day, month, year }),
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
});
