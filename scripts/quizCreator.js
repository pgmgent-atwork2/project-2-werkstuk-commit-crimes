async function fetchQuizzes() {
    const $response = await fetch("http://localhost:3000/api/quiz");
    if (!$response.ok) throw new Error("Fout bij ophalen quizzes");
    return await $response.json();
}

async function fetchQuestionsByQuizId($quizId) {
    const $response = await fetch(
    `http://localhost:3000/api/questions?quiz_id=${$quizId}`
    );
    if (!$response.ok) throw new Error("Fout bij ophalen vragen");
    return await $response.json();
}

async function showQuizzes() {
    try {
    const $quizzes = await fetchQuizzes();

    const $quizContainer = document.getElementById("quiz-list");
    const $template = $quizContainer.querySelector("#quiz-template");

    Array.from($quizContainer.children).forEach((child) => {
        if (child !== $template) {
        $quizContainer.removeChild(child);
        }
    });

    $quizzes.forEach(($quiz, $index) => {
        const $clone = $template.content.cloneNode(true);

        $clone.querySelector(".quiz-title").textContent = `Quiz ${$index + 1}: ${
        $quiz.title
        }`;

        const $dropdownBtn = $clone.querySelector(".quiz-item__dropdown-btn");
        const $form = $clone.querySelector(".quiz-item__form");
        $form.style.display = "none";

        const $questionsTitle = $clone.querySelector(".quiz-questions-title");
        const $questionsContainer = $clone.querySelector(".quiz-item__questions");
        $questionsTitle.style.display = "none";
        $questionsContainer.style.display = "none";

        let $questionsLoaded = false;

        $dropdownBtn.addEventListener("click", async () => {
        if ($form.style.display === "none") {
            $form.style.display = "flex";
        } else {
            $form.style.display = "none";
        }

        if (!$questionsLoaded) {
            try {
            const $questions = await fetchQuestionsByQuizId($quiz.id);

            $questionsContainer.innerHTML = "";

            $questions.forEach(($question) => {
                const $questionEl = document.createElement("div");
                $questionEl.classList.add("quiz-question");
                $questionEl.textContent = $question.question_text;
                $questionsContainer.appendChild($questionEl);
            });

            $questionsLoaded = true;
            $questionsTitle.style.display = "block";
            $questionsContainer.style.display = "block";
            } catch ($error) {
            console.error("Fout bij ophalen van vragen:", $error);
            }
        } else {
            const $visible = $questionsContainer.style.display === "none";
            $questionsTitle.style.display = $visible ? "block" : "none";
            $questionsContainer.style.display = $visible ? "block" : "none";
        }
        });

        $quizContainer.appendChild($clone);
    });
    } catch ($error) {
    console.error("Fout bij ophalen van quizzen:", $error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    showQuizzes();
});

export default showQuizzes;
