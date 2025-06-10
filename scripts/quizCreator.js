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

async function updateQuizTitle($id, $newTitle) {
  const $response = await fetch(`http://localhost:3000/api/quiz/${$id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: $newTitle }),
  });
  if (!$response.ok) throw new Error("Fout bij bijwerken van quiz");
  return await $response.json();
}

async function deleteQuestionById($questionId) {
  const $response = await fetch(
    `http://localhost:3000/api/questions/${$questionId}`,
    {
      method: "DELETE",
    }
  );
  if (!$response.ok) throw new Error("Fout bij verwijderen van vraag");
  return await $response.json();
}

async function updateQuestionText($questionId, $newText) {
  const $response = await fetch(
    `http://localhost:3000/api/questions/${$questionId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_text: $newText }),
    }
  );
  if (!$response.ok) throw new Error("Fout bij bewerken van vraag");
  return await $response.json();
}

async function fetchAnswersByQuestionId($questionId) {
  const $response = await fetch(
    `http://localhost:3000/api/answers?question_id=${$questionId}`
  );
  if (!$response.ok) throw new Error("Fout bij ophalen antwoorden");
  return await $response.json();
}

async function updateAnswer($answerId, $newText) {
  const $response = await fetch(
    `http://localhost:3000/api/answers/${$answerId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer_text: $newText }),
    }
  );
  if (!$response.ok) throw new Error("Fout bij bewerken van antwoord");
  return await $response.json();
}

async function deleteAnswerById($answerId) {
  const $response = await fetch(
    `http://localhost:3000/api/answers/${$answerId}`,
    {
      method: "DELETE",
    }
  );
  if (!$response.ok) throw new Error("Fout bij verwijderen van antwoord");
  return await $response.json();
}

async function addAnswer($questionId, $answerText, $isCorrect) {
  const $response = await fetch("http://localhost:3000/api/answers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_id: $questionId,
      answer_text: $answerText,
      is_correct: $isCorrect,
    }),
  });

  if (!$response.ok) throw new Error("Fout bij toevoegen van antwoord");

  return await $response.json();
}

async function addQuiz(title) {
  const $response = await fetch("http://localhost:3000/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, language: "nl" }),
  });
  if (!$response.ok) throw new Error("Fout bij toevoegen van quiz");
  return await $response.json();
}

async function deleteQuizById(quizId) {
  const $response = await fetch(`http://localhost:3000/api/quiz/${quizId}`, {
    method: "DELETE",
  });
  if (!$response.ok) throw new Error("Fout bij verwijderen van quiz");
  return await $response.json();
}

function renderQuiz($quiz, $index, $templates, $container) {
  const { quizTemplate: $quizTemplate } = $templates;
  const $clone = $quizTemplate.content.cloneNode(true);

  const $titleEl = $clone.querySelector(".quiz-title");
  $titleEl.textContent = `Quiz ${$index + 1}: ${$quiz.title}`;

  const $deleteBtn = $clone.querySelector(".delete__btn");
  $deleteBtn.addEventListener("click", async () => {
    try {
      await deleteQuizById($quiz.id);
      $container.removeChild($clone);
    } catch ($err) {
      console.error("Fout bij verwijderen van quiz:", $err);
    }
  });

  const $dropdownBtn = $clone.querySelector(".quiz-item__dropdown-btn");
  const $form = $clone.querySelector(".quiz-item__form");
  const $input = $clone.querySelector("input[type='text']");

  $form.style.display = "none";
  $form.addEventListener("submit", async ($e) => {
    $e.preventDefault();
    const $newTitle = $input.value.trim();
    if (!$newTitle) return alert("Titel mag niet leeg zijn");

    try {
      await updateQuizTitle($quiz.id, $newTitle);
      $titleEl.textContent = `Quiz ${$index + 1}: ${$newTitle}`;
      $form.style.display = "none";
    } catch ($err) {
      console.error("Fout bij bijwerken van quiz:", $err);
    }
  });

  const $questionsTitle = $clone.querySelector(".quiz-questions-title");
  const $questionsContainer = $clone.querySelector(".quiz-item__questions");
  $questionsTitle.style.display = "none";
  $questionsContainer.style.display = "none";
  $questionsContainer.dataset.quizId = $quiz.id;
  let $questionsLoaded = false;

  let $addQuestionSection = $clone.querySelector(".add-question-section");
  if ($addQuestionSection) {
  const $form = $addQuestionSection.querySelector(".add-question-form");
  const $input = $form.querySelector(".add-question-input");
  const $fileInput = $form.querySelector("input[type='file']");

  $form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const questionText = $input.value.trim();
    if (!questionText) return alert("Vraag mag niet leeg zijn");

    const formData = new FormData();
    formData.append("question_text", questionText);
    formData.append("quiz_id", $quiz.id);
    if ($fileInput && $fileInput.files.length > 0) {
      formData.append("image", $fileInput.files[0]);
    }

    try {
      const response = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorBody}`);
      }

      const newQuestion = await response.json();
      renderQuestion(newQuestion, $templates, $questionsContainer);
      $input.value = "";
      if ($fileInput) $fileInput.value = "";
    } catch (err) {
      console.error("Fout bij toevoegen van vraag:", err);
      alert("Fout bij toevoegen van vraag");
    }
  });

  $addQuestionSection.style.display = "block";
  $questionsContainer.appendChild($addQuestionSection);
  }

  $dropdownBtn.addEventListener("click", async () => {
    $form.style.display = $form.style.display === "none" ? "flex" : "none";

    if (!$questionsLoaded) {
      try {
        const $questions = await fetchQuestionsByQuizId($quiz.id);
        $questionsContainer.innerHTML = "";

        for (const $question of $questions) {
          renderQuestion($question, $templates, $questionsContainer);
        }

        if ($addQuestionSection) {
          $addQuestionSection.style.display = "block";
          $questionsContainer.appendChild($addQuestionSection);
        }

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
      if ($addQuestionSection)
        $addQuestionSection.style.display = $visible ? "block" : "none";
    }
  });

  $container.appendChild($clone);
}

function renderQuestion($question, $templates, $container) {
  const {
    questionTemplate: $questionTemplate,
    answerTemplate: $answerTemplate,
  } = $templates;
  const $clone = $questionTemplate.content.cloneNode(true);
  const $questionDiv = $clone.querySelector(".quiz-question");
  const $textSpan = $clone.querySelector(".question-text");
  const $editInput = $clone.querySelector(".edit-question-input");
  const $saveBtn = $clone.querySelector(".save-question-btn");
  const $editBtn = $clone.querySelector(".edit-question-btn");
  const $deleteBtn = $clone.querySelector(".delete-question-btn");
  const $dropdownBtn = $clone.querySelector(".question-dropdown-btn");

  $textSpan.textContent = $question.question_text;
  $editInput.value = $question.question_text;
  $editInput.style.display = "none";
  $saveBtn.style.display = "none";

  $editBtn.addEventListener("click", () => {
    $textSpan.style.display = "none";
    $editBtn.style.display = "none";
    $editInput.style.display = "inline-block";
    $saveBtn.style.display = "inline-block";
  });

  $saveBtn.addEventListener("click", async () => {
    const $newText = $editInput.value.trim();
    if (!$newText) return alert("Vraagtekst mag niet leeg zijn");

    try {
      await updateQuestionText($question.id, $newText);
      $textSpan.textContent = $newText;
      $textSpan.style.display = "inline";
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

  const $addAnswersSection = $questionDiv.querySelector(".add-answers");
  if ($addAnswersSection) $addAnswersSection.style.display = "none";

  const $addQuestionSection = $clone.querySelector(".add-question-section");
  if ($addQuestionSection) {
    $addQuestionSection.style.display = "none";
    $addQuestionSection.remove();
  }

  $dropdownBtn.addEventListener("click", async () => {
    let $answersContainer = $questionDiv.querySelector(".answers-container");
    if (!$answersContainer) {
      $answersContainer = document.createElement("div");
      $answersContainer.classList.add("answers-container");
      $questionDiv.appendChild($answersContainer);
    }

    if ($answersContainer.style.display === "block") {
      $answersContainer.style.display = "none";
      if ($addAnswersSection) $addAnswersSection.style.display = "none";
      if ($addQuestionSection) $addQuestionSection.style.display = "none";
      return;
    }

    $answersContainer.innerHTML = "Laden antwoorden...";
    $answersContainer.style.display = "block";
    if ($addAnswersSection) $addAnswersSection.style.display = "block";
    if ($addQuestionSection) $addQuestionSection.style.display = "block";

    try {
      const $answers = await fetchAnswersByQuestionId($question.id);
      $answersContainer.innerHTML = "";

      for (const $answer of $answers) {
        renderAnswer($answer, $answerTemplate, $answersContainer, $question.id);
      }

      if ($addAnswersSection) {
        const $addBtns = $addAnswersSection.querySelectorAll(".add-answer-btn");
        $addBtns.forEach(($btn) => {
          $btn.onclick = null;
          $btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const $isCorrect = $btn.getAttribute("data-correct") === "true";
            const $input =
              $btn.parentElement.querySelector(".add-answer-input");
            const $answerText = $input.value.trim();
            if (!$answerText) return alert("Antwoord mag niet leeg zijn");

            try {
              const $newAnswer = await addAnswer(
                $question.id,
                $answerText,
                $isCorrect
              );
              renderAnswer(
                $newAnswer,
                $answerTemplate,
                $answersContainer,
                $question.id
              );
              $input.value = "";
            } catch (err) {
              alert("Fout bij toevoegen van antwoord");
              console.error(err);
            }
          });
        });
      }

      if ($addQuestionSection) {
        const $addQuestionBtn =
          $addQuestionSection.querySelector(".add-question-btn");
        const $addQuestionInput = $addQuestionSection.querySelector(
          ".add-question-input"
        );
        $addQuestionBtn.onclick = null;
        $addQuestionBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          const $questionText = $addQuestionInput.value.trim();
          if (!$questionText) return alert("Vraag mag niet leeg zijn");

          try {
            const $quizId = $question.quiz_id;
            const $response = await fetch(
              "http://localhost:3000/api/questions",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  question_text: $questionText,
                  quiz_id: $quizId,
                }),
              }
            );
            if (!$response.ok) throw new Error("Fout bij toevoegen van vraag");
            const $newQuestion = await $response.json();
            renderQuestion($newQuestion, $templates, $container);
            $addQuestionInput.value = "";
          } catch (err) {
            alert("Fout bij toevoegen van vraag");
            console.error(err);
          }
        });
      }
    } catch ($error) {
      $answersContainer.textContent = "Fout bij laden antwoorden.";
      console.error($error);
    }
  });

  $container.appendChild($clone);
}

function renderAnswer($answer, $answerTemplate, $container) {
  const $clone = $answerTemplate.content.cloneNode(true);
  const $answerDiv = $clone.querySelector(".answer-item");

  let $answerTextSpan = $clone.querySelector(".answer-text");
  if (!$answerTextSpan) {
    $answerTextSpan = document.createElement("span");
    $answerTextSpan.className = "answer-text";
    $answerDiv.insertBefore($answerTextSpan, $answerDiv.firstChild);
  }

  const $editInput = $clone.querySelector(".edit-answer-input");
  const $saveBtn = $clone.querySelector(".save-answer-btn");
  const $editBtn = $clone.querySelector(".edit-answer-btn");
  const $deleteBtn = $clone.querySelector(".delete-answer-btn");

  $answerTextSpan.textContent = $answer.answer_text;
  $editInput.value = $answer.answer_text;
  $editInput.style.display = "none";
  $saveBtn.style.display = "none";

  if ($answer.is_correct) {
    $answerDiv.classList.add("correct-answer");
  } else {
    $answerDiv.classList.add("wrong-answer");
  }

  $editBtn.addEventListener("click", () => {
    $answerTextSpan.style.display = "none";
    $editInput.style.display = "inline-block";
    $saveBtn.style.display = "inline-block";
    $editBtn.style.display = "none";
    $editInput.focus();
  });

  $saveBtn.addEventListener("click", async () => {
    const $newText = $editInput.value.trim();
    if (!$newText) return alert("Antwoordtekst mag niet leeg zijn");

    try {
      await updateAnswer($answer.id, $newText);
      $answerTextSpan.textContent = $newText;
      $answerTextSpan.style.display = "inline";
      $editInput.style.display = "none";
      $saveBtn.style.display = "none";
      $editBtn.style.display = "inline-block";
    } catch ($err) {
      console.error("Fout bij bewerken van antwoord:", $err);
    }
  });

  $deleteBtn.addEventListener("click", async () => {
    try {
      await deleteAnswerById($answer.id);
      $answerDiv.remove();
    } catch ($err) {
      console.error("Fout bij verwijderen van antwoord:", $err);
    }
  });

  $container.appendChild($clone);
}

function initQuizzes() {
  const $quizList = document.getElementById("quiz-list");

  const $templates = {
    quizTemplate: document.getElementById("quiz-template"),
    questionTemplate: document.getElementById("question-template"),
    answerTemplate: document.getElementById("answer-template"),
  };

  fetchQuizzes()
    .then(($quizzes) => {
      $quizzes.forEach(($quiz, $index) => {
        renderQuiz($quiz, $index, $templates, $quizList);
      });
    })
    .catch(($error) => {
      console.error("Fout bij laden van quizzes:", $error);
    });

  const $addQuizForm = document.querySelector(".add-quizzes form");
  if ($addQuizForm) {
    $addQuizForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const $input = $addQuizForm.querySelector("input[type='text']");
      const title = $input.value.trim();
      if (!title) return alert("Titel mag niet leeg zijn");
      try {
        const $newQuiz = await addQuiz(title);

        const $quizCount = $quizList.querySelectorAll("template").length;
        renderQuiz($newQuiz, $quizCount, $templates, $quizList);
        $input.value = "";
      } catch (err) {
        alert("Fout bij toevoegen van quiz");
        console.error(err);
      }
    });
  }
}

export default initQuizzes;
