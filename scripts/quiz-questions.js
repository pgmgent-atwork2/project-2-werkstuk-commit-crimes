let quizData = [];
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
const restartBtn = document.getElementById("restart-btn");

function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

async function fetchQuizData() {
  const params = getQueryParams();
  const quizId = params.get("quiz_id");
  if (!quizId) {
    alert("Geen quiz geselecteerd.");
    return;
  }

  const quizRes = await fetch(`http://localhost:3000/api/quiz/${quizId}`);
  if (!quizRes.ok) throw new Error("Quiz ophalen mislukt");
  const quiz = await quizRes.json();

  console.log("Quiz taal:", quiz.language);

  const questionsRes = await fetch(`http://localhost:3000/api/questions?quiz_id=${quiz.id}`);
  if (!questionsRes.ok) throw new Error("Vragen ophalen mislukt");
  const questions = await questionsRes.json();

  const questionsWithAnswers = await Promise.all(
    questions.map(async (q) => {
      const answersRes = await fetch(`http://localhost:3000/api/answers?question_id=${q.id}`);
      if (!answersRes.ok) throw new Error("Antwoorden ophalen mislukt");
      const answers = await answersRes.json();
      return {
        ...q,
        answers,
      };
    })
  );

  quizData = questionsWithAnswers;
  currentQuestion = 0;
  score = 0;
  showQuestion();
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
  if (answer?.is_correct) score++;
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerInterval);
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  scoreEl.textContent = `${score} / ${quizData.length}`;
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

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  quizContainer.style.display = "block";
  resultContainer.style.display = "none";
  showQuestion();
  startTimer();
});

fetchQuizData().catch((err) => {
  console.error("Kon quiz niet laden:", err);
});
