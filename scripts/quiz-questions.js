export function getUserIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("user_id");
}

let quizData = [];
let userAnswers = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

const timerEl = document.getElementById("timer");
const questionEl = document.getElementById("question-text");
const imageEl = document.getElementById("image-container");
const answerBtns = [
  document.getElementById("answer-1"),
  document.getElementById("answer-2"),
  document.getElementById("answer-3"),
  document.getElementById("answer-4"),
];
const questionProgress = document.getElementById("question-progress");
const quizContainer = document.getElementById("quiz-question-container");
const resultContainer = document.getElementById("quiz-result-container");
const scoreEl = document.getElementById("score");

async function fetchQuizData() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = parseInt(urlParams.get("session_id"));
  const quizId = parseInt(urlParams.get("quiz_id"));

  if (!sessionId || !quizId) {
    alert("Session ID or Quiz ID is missing from the URL");
    return;
  }

  try {
    const sessionsRes = await fetch("http://localhost:3000/api/sessions");
    if (!sessionsRes.ok) throw new Error("Failed to fetch sessions");
    const sessions = await sessionsRes.json();

    const session = sessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");

    const quiz = session.groupQuizzes?.find((q) => q.id === quizId);
    if (!quiz) throw new Error("Quiz not found in session");

    const questions = quiz.questions || [];
    if (questions.length === 0) throw new Error("No questions found for this quiz");

    const questionsWithAnswers = await Promise.all(
      questions.map(async (q) => {
        const answersRes = await fetch(`http://localhost:3000/api/answers?question_id=${q.id}`);
        if (!answersRes.ok) throw new Error("Failed to load answers");
        const answers = await answersRes.json();
        return { ...q, answers };
      })
    );

    quizData = questionsWithAnswers;
    currentQuestion = 0;
    score = 0;
    showQuestion();
  } catch (err) {
    console.error("Error loading quiz:", err);
    alert(err.message);
  }
}

function showQuestion() {
  clearInterval(timerInterval);
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  startTimer();

  const q = quizData[currentQuestion];
  questionEl.textContent = q.question_text;
  questionProgress.textContent = `${currentQuestion + 1}/${quizData.length}`;

  if (q.image_path) {
    const img = document.createElement("img");
    img.src = q.image_path;
    img.alt = "Vraagafbeelding";
    imageEl.innerHTML = "";
    imageEl.appendChild(img);
  } else {
    imageEl.innerHTML = "";
  }

  const answers = q.answers || [];
  answerBtns.forEach((btn, i) => {
    btn.textContent = answers[i]?.answer_text || "";
    btn.onclick = () => checkAnswer(answers[i]);
  });
}

function checkAnswer(answer) {
  userAnswers[currentQuestion] = answer;

  if (answer?.is_correct) score++;

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 500);
}

function endQuiz() {
  clearInterval(timerInterval);
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  scoreEl.textContent = `${score} / ${quizData.length}`;
  showReview();
  saveScore();
}

function startTimer() {
  timerEl.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      checkAnswer(null);
    }
  }, 1000);
}

fetchQuizData().catch((err) => {
  console.error("Kon quiz niet laden:", err);
});

function showReview() {
  const container = document.getElementById("review-answers-container");
  container.innerHTML = "";

  quizData.forEach((question, i) => {
    const userAnswer = userAnswers[i];

    const questionDiv = document.createElement("div");
    questionDiv.className = "review-question";

    const questionTitle = document.createElement("p");
    questionTitle.className = "review-question-title";
    questionTitle.textContent = `${i + 1}. ${question.question_text}`;
    questionDiv.appendChild(questionTitle);

    const answersList = document.createElement("ul");
    answersList.className = "review-answers-list";

    question.answers.forEach((answer) => {
      const li = document.createElement("li");
      li.textContent = answer.answer_text;
      li.classList.add("review-answer");

      if (answer.is_correct) {
        li.classList.add("correct-answer");
      }

      if (userAnswer && userAnswer.id === answer.id) {
        li.classList.add("user-selected");
        if (!answer.is_correct) {
          li.classList.add("incorrect-answer");
        }
      }

      answersList.appendChild(li);
    });

    questionDiv.appendChild(answersList);
    container.appendChild(questionDiv);
  });  
}


async function saveScore() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = parseInt(urlParams.get("session_id"));
  const userId = getUserIdFromUrl();
  
  if (!sessionId || !userId) {
    console.error("Session ID of User ID ontbreekt");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/users/save-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId,
        score: score
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Kon score niet opslaan");
    console.log("Score opgeslagen:", data);
  } catch (error) {
    console.error("Fout bij opslaan score:", error);
  }
}
