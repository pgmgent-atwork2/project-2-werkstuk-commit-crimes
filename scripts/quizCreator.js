document.addEventListener("DOMContentLoaded", function () {
  async function showQuizes() {
    try {
      const $response = await fetch("http://localhost:3000/api/quiz");
      const $data = await $response.json();

      const $quizContainer = document.getElementById("quiz-list");
      const $template = document.getElementById("quiz-template");

      $quizContainer.innerHTML = "";

      $data.forEach((quiz, index) => {
        const $clone = $template.content.cloneNode(true);

        // Vul de titel in
        $clone.querySelector(".quiz-title").textContent = `Quiz ${index + 1}: ${
          quiz.title
        }`;

        // Voeg extra logica toe als je wil
        const $dropdownBtn = $clone.querySelector(".quiz-item__dropdown-btn");
        const $form = $clone.querySelector(".quiz-item__form");

        $dropdownBtn.addEventListener("click", () => {
          $form.style.display =
            $form.style.display === "none" ? "block" : "none";
        });

        $quizContainer.appendChild($clone);
      });
    } catch ($error) {
      console.error("Fout bij ophalen van quizen:", $error);
    }
  }

  showQuizes();
});

export default showQuizes;
