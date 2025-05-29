const quizData = [
  {
    question: "Wat weet je over de oren van een dolfijn?",
    options: [
      "Een dolfijn heeft geen oren.",
      "Een dolfijn heeft wel oren maar geen uitwendige oorschelpen.",
      "Een dolfijn heeft wel oren en uitwendige oorschelpen.",
      "Hier weet ik niets over.",
    ],
    answer: "Een dolfijn heeft wel oren maar geen uitwendige oorschelpen.",
  },
  {
    question: "Wat is sonar?",
    options: [
      "Lichtstralen zeer gevoelig kunnen oppikken zodat ze heel goed kunnen zien in donker water.",
      "Bepaalde frequenties in geluidsgolven horen dat mensen niet kunnen horen.",
      "Geluidjes uitsturen die botsen op een prooi en terugkomen zodat een dolfijn kan zien zonder geluid.",
      "Dat weet ik niet.",
    ],
    answer:
      "Geluidjes uitsturen die botsen op een prooi en terugkomen zodat een dolfijn kan zien zonder geluid.",
  },
  {
    question: "Is een dolfijn een solitair dier?",
    options: [
      "Ja, ze is graag alleen.",
      "Ze is liever in een kleine groep.",
      "Neen, ze leeft in groepen.",
      "Dat weet ik niet.",
    ],
    answer: "Neen, ze leeft in groepen.",
  },
  {
    question: "Zitten er botten in de finnen van een dolfijn?",
    options: [
      "Ja, in de borstvinnen en staartvin.",
      "Enkel in de staartvin.",
      "Enkel in de rugvin.",
      "Enkel in de borstvinnen.",
    ],
    answer: "Ja, in de borstvinnen en staartvin.",
  },
  {
    question: "Hoe weet je of de dolfijn een mannetje of een vrouwtje is?",
    options: [
      "De mannetjes hebben langere sierlijkere vinnen dan de vrouwtjes.",
      "De mannetjes hebben een donkerdere kleur dan de vrouwtjes.",
      "De mannetjes hebben 2 spleetjes op de buik, de vrouwtjes maar 1.",
      "De mannetjes hebben 1 spleetje op de buik, de vrouwtjes 2.",
    ],
    answer: "De mannetjes hebben 2 spleetjes op de buik, de vrouwtjes maar 1.",
  },
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;
const timerEl = document.getElementById("time");
const questionEl = document.querySelector(".question");
const optionsEl = document.querySelector(".options");
const resultEl = document.querySelector(".result");
const scoreEl = document.getElementById("score");
const restartBtn = document.querySelector(".restart-btn");

function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    endQuiz();
    return;
  }
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
