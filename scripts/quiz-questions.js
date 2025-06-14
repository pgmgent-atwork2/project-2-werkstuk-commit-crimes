let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
const timerEl = document.getElementById("time");
const questionEl = document.querySelector(".question");
const optionsEl = document.querySelector(".options");
const resultEl = document.querySelector(".result");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");

async function fetchQuizData() {

  const quizRes = await fetch("http://localhost:3000/api/quiz?language=nl");
  if (!quizRes.ok) throw new Error("Quiz ophalen mislukt");
  const quizzes = await quizRes.json();
  const quiz = Array.isArray(quizzes)
    ? quizzes.find((q) => q.language === "nl")
    : quizzes;
  if (!quiz) throw new Error("Geen NL quiz gevonden");


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
  const currentQuiz = quizData[currentQuestion];
  questionEl.textContent = currentQuiz.question;
  optionsEl.innerHTML = "";
  currentQuiz.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("option");
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsEl.appendChild(button);
  });
}

function checkAnswer(selectedOption) {
  if (selectedOption === quizData[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;
  loadQuestion();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timerInterval);
  questionEl.style.display = "none";
  optionsEl.style.display = "none";
  resultEl.style.display = "block";
  scoreEl.textContent = score;
  restartBtn.style.display = "block";
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  timeLeft = 30;
  timerEl.textContent = timeLeft;

  questionEl.style.display = "block";
  optionsEl.style.display = "flex";
  resultEl.style.display = "none";
  restartBtn.style.display = "none";

  loadQuestion();
});

loadQuestion();
