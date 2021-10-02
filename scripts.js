const questions = [
  {
    id: 1,
    question: "Are you a student?",
    choices: [
      { id: 1, answer: "Yes", value: "Y", correct: true },
      { id: 2, answer: "No", value: "N", correct: false },
      { id: 3, answer: "Maybe", value: "M", correct: false },
      { id: 4, answer: "I don't understand", value: "X", correct: false },
    ],
  },
  {
    id: 2,
    question: "Is JavaScript Java?",
    choices: [
      { id: 1, answer: "Yes", value: "Y", correct: false },
      { id: 2, answer: "No", value: "N", correct: true },
      { id: 3, answer: "Maybe", value: "M", correct: false },
      { id: 4, answer: "I don't understand", value: "X", correct: false },
    ],
  },
];

const startBtn = document.getElementById("start");
const quizEl = document.getElementById("quiz");
const quizBtn = document.getElementById("next");
const quizCompleteEl = document.getElementById("quizComplete");
const timerEl = document.getElementById("clock");
const recordScoreBtn = document.getElementById("recordScore");
const scoreBoard = document.getElementById("scoreBoard");
const recordScoreForm = document.getElementById("recordScoreForm");

let correctTotal;
let currentQuestion;
let timeInterval;
let quizTime;
let timePenalties;
let latestRadioClick;
let penaltyTime;
let timer = quizTime;

function initializeQuiz() {
  correctTotal = 0;
  currentQuestion = 0;
  timeInterval;
  quizTime = 10.0;
  timePenalties = 0;
  latestRadioClick = undefined;
  timer = quizTime;
  penaltyTime = 5.0;
}

function initializeScoreBoard() {
  scoreBoard.innerHTML = "";
  quizCompleteEl.innerHTML = "";
  timerEl.innerText = "";
  recordScoreBtn.style.display = "none";
  recordScoreForm.style.display = "none";
}

timerEl.style.fontSize = "100%";

function stopWatch() {
  timeInterval = setInterval(function () {
    if (timer > 0) {
      timer = timer - 0.1;
      timer = timer < 0 ? 0 : timer;
    } else {
      timer = 0;
      gameOver();
      clearInterval(timeInterval);
    }
    timerEl.innerHTML = timer.toFixed(1);
  }, 100);
}

function gameOver() {
  quizEl.style.display = "none";
  quizCompleteEl.style.display = "block";
  if (timer <= 0) {
    const timedOut = document.createElement("p");
    timedOut.innerText = "Time expired.";
    quizCompleteEl.appendChild(timedOut);
  }

  // display # of question answered
  const pAnswered = document.createElement("p");
  pAnswered.innerText = `Answered: ${currentQuestion} / ${questions.length}`;
  scoreBoard.appendChild(pAnswered);

  // display correct
  const pCorrect = document.createElement("p");
  pCorrect.innerText = `Correct: ${correctTotal}`;
  scoreBoard.appendChild(pCorrect);

  // display time penalties
  const pTimePenalties = document.createElement("p");
  pTimePenalties.innerText = `Penalties: ${timePenalties}, subtracted ${
    timePenalties * penaltyTime
  } seconds`;
  scoreBoard.appendChild(pTimePenalties);

  recordScoreBtn.style.display = "block";
  startBtn.style.display = "block";
}

recordScoreBtn.addEventListener("click", function () {
  showRecordScoreForm();
});

function showRecordScoreForm() {
  recordScoreForm.style.display = "block";
  recordScoreBtn.style.display = "none";
  startBtn.style.display = "none";
}

function recordScore(event) {
  event.preventDefault();
  const initials = document.querySelector('input[name="initials"]').value;

  const score = { score: correctTotal, name: initials, date: Date.now() };

  let highScores = [];
  const storageScores = JSON.parse(localStorage.getItem("highScores"));
  console.log(storageScores);
  if (storageScores) {
    storageScores.forEach((s) => {
      highScores.push(s);
    });
  }
  highScores.push(score);
  window.localStorage.setItem("highScores", JSON.stringify(highScores));
  recordScoreForm.style.display = "none";
  startBtn.innerText = "Restart Quiz?";
  startBtn.style.display = "block";
}

startBtn.addEventListener("click", function () {
  initializeQuiz();
  initializeScoreBoard();
  startBtn.style.display = "none";
  quizEl.style.display = "block";
  presentQuestion();
  stopWatch();
});

const h2Element = document.querySelector("h2");
const olElement = document.querySelector("ol");

function presentQuestion() {
  if (currentQuestion >= questions.length) {
    console.log(timer);
    console.log(timePenalties);
    clearInterval(timeInterval);
    if (timer < 0) {
      timerEl.innerHTML = 0;
    }
    quizEl.style.display = "none";
    quizCompleteEl.style.display = "block";
    gameOver();
    return;
  }

  h2Element.innerHTML = questions[currentQuestion].question;
  olElement.innerHTML = "";

  for (let i = 0; i < questions[currentQuestion].choices.length; i++) {
    let choice = document.createElement("li");
    let input = document.createElement("input");
    let label = document.createElement("label");

    input.dataset.id = questions[currentQuestion].choices[i].id;
    input.dataset.questionId = currentQuestion;
    input.type = "radio";
    input.value = questions[currentQuestion].choices[i].value;
    input.name = "question" + (currentQuestion + 1);
    input.id = "answer" + (i + 1);
    label.htmlFor = "answer" + (i + 1);
    label.innerHTML = questions[currentQuestion].choices[i].answer;

    olElement.appendChild(choice);
    choice.appendChild(input);
    choice.appendChild(label);
  }
}

quizBtn.addEventListener("click", function () {
  if (checkAnswer(latestRadioClick) === true) {
    correctTotal++;
  } else {
    // time penalty
    timer = timer - penaltyTime > 0 ? timer - penaltyTime : 0;
    if (timer === 0) {
      timerEl.innerHTML = timer.toFixed(1);
    }
    timePenalties++;
  }

  currentQuestion++;
  this.disabled = true;
  presentQuestion();
});

quizEl.addEventListener("click", function (event) {
  const element = event.target;
  if (element.matches('input[type="radio"]')) {
    latestRadioClick = element;
    quizBtn.disabled = false;
  }
});

function checkAnswer(el) {
  const questionId = el.dataset.questionId;
  const correctAnswer = questions[questionId].choices.find((choice) => {
    if (choice.correct === true) {
      return true;
    }
  });

  return el.dataset.id == correctAnswer.id ? true : false;
}
