export async function fetchQuizzes() {
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

async function addQuiz(title, language, group_id) {
  const $response = await fetch("http://localhost:3000/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, language, group_id }),
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

function showQuizTitle($titleEl, $index, $quiz) {
  $titleEl.textContent = `Quiz ${$index + 1}: ${$quiz.title}`;
}

function showQuestionText($textSpan, $question) {
  $textSpan.textContent = $question.question_text;
}

function showAnswerText($answerTextSpan, $answer) {
  $answerTextSpan.textContent = $answer.answer_text;
}

function enableEditQuestion($editBtn, $editInput, $saveBtn, $textSpan) {
  $editBtn.addEventListener("click", () => {
    $textSpan.style.display = "none";
    $editBtn.style.display = "none";
    $editInput.style.display = "inline-block";
    $saveBtn.style.display = "inline-block";
  });
}

function saveEditQuestion(
  $saveBtn,
  $editInput,
  $textSpan,
  $editBtn,
  $question,
  updateQuestionText
) {
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
}

function enableEditAnswer($editBtn, $editInput, $saveBtn, $answerTextSpan) {
  $editBtn.addEventListener("click", () => {
    $answerTextSpan.style.display = "none";
    $editInput.style.display = "inline-block";
    $saveBtn.style.display = "inline-block";
    $editBtn.style.display = "none";
    $editInput.focus();
  });
}

function saveEditAnswer(
  $saveBtn,
  $editInput,
  $answerTextSpan,
  $editBtn,
  $answer,
  updateAnswer
) {
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
}

function enableDeleteQuestion(
  $deleteBtn,
  $questionDiv,
  $question,
  deleteQuestionById
) {
  $deleteBtn.addEventListener("click", async () => {
    try {
      await deleteQuestionById($question.id);
      $questionDiv.remove();
    } catch ($err) {
      console.error("Fout bij verwijderen van vraag:", $err);
    }
  });
}

function enableDeleteAnswer($deleteBtn, $answerDiv, $answer, deleteAnswerById) {
  $deleteBtn.addEventListener("click", async () => {
    try {
      await deleteAnswerById($answer.id);
      $answerDiv.remove();
    } catch ($err) {
      console.error("Fout bij verwijderen van antwoord:", $err);
    }
  });
}

function renderQuiz($quiz, $index, $templates, $container) {
  const { quizTemplate: $quizTemplate } = $templates;
  const $clone = $quizTemplate.content.cloneNode(true);

  const $titleEl = $clone.querySelector(".quiz-title");
  showQuizTitle($titleEl, $index, $quiz);

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

    $form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const questionText = $input.value.trim();
      if (!questionText) return alert("Vraag mag niet leeg zijn");

      try {
        const response = await fetch("http://localhost:3000/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_text: questionText,
            quiz_id: $quiz.id,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorBody}`);
        }

        const newQuestion = await response.json();
        renderQuestion(newQuestion, $templates, $questionsContainer);
        $input.value = "";
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

  showQuestionText($textSpan, $question);
  enableEditQuestion($editBtn, $editInput, $saveBtn, $textSpan);
  saveEditQuestion(
    $saveBtn,
    $editInput,
    $textSpan,
    $editBtn,
    $question,
    updateQuestionText
  );
  enableDeleteQuestion($deleteBtn, $questionDiv, $question, deleteQuestionById);

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
  const $editInput = $clone.querySelector(".edit-answer-input");
  const $saveBtn = $clone.querySelector(".save-answer-btn");
  const $editBtn = $clone.querySelector(".edit-answer-btn");
  const $deleteBtn = $clone.querySelector(".delete-answer-btn");

  showAnswerText($answerTextSpan, $answer);
  enableEditAnswer($editBtn, $editInput, $saveBtn, $answerTextSpan);
  saveEditAnswer(
    $saveBtn,
    $editInput,
    $answerTextSpan,
    $editBtn,
    $answer,
    updateAnswer
  );
  enableDeleteAnswer($deleteBtn, $answerDiv, $answer, deleteAnswerById);

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
      const grouped = {};
      $quizzes.forEach((quiz) => {
    if (!grouped[quiz.group_id]) {
      grouped[quiz.group_id] = [];
  }
  grouped[quiz.group_id].push(quiz);
});

let groupCounter = 1;
for (const groupId in grouped) {
  const groupQuizzes = grouped[groupId];
  renderQuizGroup(groupQuizzes, groupCounter++, $templates, $quizList);
}
    })
    .catch(($error) => {
      console.error("Fout bij laden van quizzes:", $error);
    });

  const $addQuizForm = document.querySelector(".add-quizzes form");
  $addQuizForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const $input = $addQuizForm.querySelector(".quiz-add-txt");
  const baseTitle = $input.value.trim();

  if (!baseTitle) {
    return alert("Titel mag niet leeg zijn");
  }

  try {
    const group_id = Date.now(); // simple unique ID

    const quizzes = await Promise.all([
      addQuiz(`${baseTitle} - NL`, "nl", group_id),
      addQuiz(`${baseTitle} - EN`, "en", group_id),
      addQuiz(`${baseTitle} - FR`, "fr", group_id),
    ]);

    const $quizList = document.getElementById("quiz-list");
    const $templates = {
      quizTemplate: document.getElementById("quiz-template"),
      questionTemplate: document.getElementById("question-template"),
      answerTemplate: document.getElementById("answer-template"),
    };

    quizzes.forEach((quiz, index) => {
      renderQuiz(quiz, index, $templates, $quizList);
    });

    $addQuizForm.reset();
  } catch (err) {
    alert("Fout bij toevoegen van quizgroep");
    console.error(err);
  }
});
}

function renderQuizGroup(quizzes, index, templates, container) {
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("quiz-group");

  const title = quizzes[0].title.split(" - ")[0];
  const groupHeader = document.createElement("h2");
  groupHeader.textContent = `Quiz ${index}: ${title}`;
  groupHeader.classList.add("quiz-group__title");

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete__btn");

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "/images/delete-icon.svg";
  deleteIcon.alt = "delete button";

  deleteBtn.appendChild(deleteIcon);

  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm(`Weet je zeker dat je quizgroep "${title}" wilt verwijderen?`);
    if (!confirmDelete) return;

    try {
      for (const quiz of quizzes) {
        await deleteQuizById(quiz.id);
      }
      container.removeChild(groupDiv);
    } catch (err) {
      alert("Fout bij verwijderen van quizgroep");
      console.error(err);
    }
  });

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Toon quizversies";
  toggleBtn.classList.add("quiz-group__toggle");

  const groupContent = document.createElement("div");
  groupContent.classList.add("quiz-group__content");
  groupContent.style.display = "none";

  toggleBtn.addEventListener("click", () => {
    const visible = groupContent.style.display === "block";
    groupContent.style.display = visible ? "none" : "block";
    toggleBtn.textContent = visible ? "Toon quizversies" : "Verberg quizversies";
  });

  quizzes.forEach((quiz, idx) => {
    renderQuiz(quiz, idx, templates, groupContent);
  });

  groupDiv.appendChild(groupHeader);

  groupDiv.appendChild(toggleBtn);
  groupDiv.appendChild(deleteBtn);
  groupDiv.appendChild(groupContent);
  container.appendChild(groupDiv);
}

document.addEventListener('DOMContentLoaded',() => {    
    initQuizzes();
})
