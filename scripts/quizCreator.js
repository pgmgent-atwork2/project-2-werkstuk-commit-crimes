async function fetchQuizzes() {
    const $response = await fetch("http://localhost:3000/api/quiz");
    if (!$response.ok) throw new Error("Fout bij ophalen quizzes");
    return await $response.json();
}

async function fetchQuestionsByQuizId(quizId) {
    const $response = await fetch(
    `http://localhost:3000/api/questions?quiz_id=${quizId}`
    );
    if (!$response.ok) throw new Error("Fout bij ophalen vragen");
    return await $response.json();
}

async function updateQuizTitle(id, newTitle) {
    const $response = await fetch(`http://localhost:3000/api/quiz/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle }),
    });
    if (!$response.ok) throw new Error("Fout bij bijwerken van quiz");
    return await $response.json();
}

async function deleteQuestionById(questionId) {
    const $response = await fetch(
    `http://localhost:3000/api/questions/${questionId}`,
    {
        method: "DELETE",
    }
    );
    if (!$response.ok) throw new Error("Fout bij verwijderen van vraag");
    return await $response.json();
}

async function updateQuestionText(questionId, newText) {
    const $response = await fetch(
    `http://localhost:3000/api/questions/${questionId}`,
    {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_text: newText }),
    }
    );
    if (!$response.ok) throw new Error("Fout bij bewerken van vraag");
    return await $response.json();
}

async function showQuizzes() {
    try {
    const $quizzes = await fetchQuizzes();

    const $quizContainer = document.getElementById("quiz-list");
    const $quizTemplate = document.getElementById("quiz-template");
    const $questionTemplate = document.getElementById("question-template");

    Array.from($quizContainer.children).forEach(($child) => {
        if ($child !== $quizTemplate) $quizContainer.removeChild($child);
    });

    $quizzes.forEach(($quiz, $index) => {
        const $clone = $quizTemplate.content.cloneNode(true);

        const $quizTitleEl = $clone.querySelector(".quiz-title");
        $quizTitleEl.textContent = `Quiz ${$index + 1}: ${$quiz.title}`;

        const $dropdownBtn = $clone.querySelector(".quiz-item__dropdown-btn");
        const $form = $clone.querySelector(".quiz-item__form");
        $form.style.display = "none";
        const $input = $clone.querySelector("input[type='text']");

        $form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const $newTitle = $input.value.trim();
        if (!$newTitle) return alert("Titel mag niet leeg zijn");

        try {
            await updateQuizTitle($quiz.id, $newTitle);
            $quizTitleEl.textContent = `Quiz ${$index + 1}: ${$newTitle}`;
            $form.style.display = "none";
        } catch ($err) {
            console.error("Fout bij bijwerken:", $err);
        }
        });

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
                const $questionClone = $questionTemplate.content.cloneNode(true);

                const $questionDiv =
                $questionClone.querySelector(".quiz-question");
                const $questionTextSpan =
                $questionClone.querySelector(".question-text");
                const $editInput = $questionClone.querySelector(
                ".edit-question-input"
                );
                const $saveBtn =
                $questionClone.querySelector(".save-question-btn");
                const $editBtn =
                $questionClone.querySelector(".edit-question-btn");
                const $deleteBtn = $questionClone.querySelector(
                ".delete-question-btn"
                );
            
                $questionTextSpan.textContent = $question.question_text;
                $editInput.value = $question.question_text;

                $editBtn.addEventListener("click", () => {
                $questionTextSpan.style.display = "none";
                $editBtn.style.display = "none";

                $editInput.style.display = "inline-block";
                $saveBtn.style.display = "inline-block";
                });

                $saveBtn.addEventListener("click", async () => {
                const $newText = $editInput.value.trim();
                if (!$newText) return alert("Vraagtekst mag niet leeg zijn");

                try {
                    await updateQuestionText($question.id, $newText);
                    $questionTextSpan.textContent = $newText;

                    $questionTextSpan.style.display = "inline";
                    $editBtn.style.display = "inline-block";

                    $editInput.style.display = "none";
                    $saveBtn.style.display = "none";
                } catch ($err) {
                    console.error("Fout bij bewerken van vraag:", $err);
                }
                });

                $deleteBtn.addEventListener("click", async () => {
                try {
                    await deleteQuestionById($question.id);
                    $questionDiv.remove();
                } catch ($err) {
                    console.error("Fout bij verwijderen van vraag:", $err);
                }
                });

                $questionsContainer.appendChild($questionClone);
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

export default showQuizzes;
