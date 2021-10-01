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

let correctTotal = 0;
let currentQuestion = 0;

const startBtn = document.getElementById("start");
const quizEl = document.getElementById("quiz");
const quizButton = document.getElementById("next");
const quizCompleteEl = document.getElementById("quizComplete");
const timerEl = document.getElementById("clock");
let timeInterval;
let quizTime = 5.0;

// latest radio button clicked
let latestRadioClick;

// timer
let timer = quizTime;

timerEl.style.fontSize = "100%";

function stopWatch() {
  timeInterval = setInterval(function () {
    if (timer > 0) {
      timer = timer - 0.1;
      timer = timer < 0 ? 0 : timer;
      timerEl.innerHTML = timer.toFixed(1);
    } else {
      timer = parseInt(timer);
      gameOver();
      clearInterval(timeInterval);
    }
  }, 100);
}

function gameOver() {
  quizEl.style.display = "none";
  quizCompleteEl.style.display = "block";
  if (timer === 0) {
    const timedOut = document.createElement("p");
    timedOut.innerText = "Time expired.";
    quizCompleteEl.appendChild(timedOut);
  }
  const score = document.createElement("div");

  // display correct
  const pCorrect = document.createElement("p");
  pCorrect.innerText = `Correct: ${correctTotal}`;
  score.appendChild(pCorrect);

  // display # of question answered
  const pAnswered = document.createElement("p");
  pAnswered.innerText = `Answered: ${currentQuestion} / ${questions.length}`;
  score.appendChild(pAnswered);

  // display time left
  const pTimeUsed = document.createElement("p");
  const timeUsed = quizTime - timer;
  pTimeUsed.innerText = `Time used: ${timeUsed.toFixed(1)} seconds`;
  score.appendChild(pTimeUsed);

  quizCompleteEl.appendChild(score);
}

startBtn.addEventListener("click", function () {
  startBtn.style.display = "none";
  quizEl.style.display = "block";
  presentQuestion();
  stopWatch();
});

const h2Element = document.querySelector("h2");
const olElement = document.querySelector("ol");

function presentQuestion() {
  if (currentQuestion >= questions.length) {
    clearInterval(timeInterval);
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

quizButton.addEventListener("click", function () {
  correctTotal = checkAnswer(latestRadioClick)
    ? correctTotal + 1
    : correctTotal;
  currentQuestion++;
  this.disabled = true;
  presentQuestion();
});

quizEl.addEventListener("click", function (event) {
  const element = event.target;
  if (element.matches('input[type="radio"]')) {
    latestRadioClick = element;
    quizButton.disabled = false;
  }
});

function checkAnswer(el) {
  const questionId = el.dataset.questionId;
  const correctAnswer = questions[questionId].choices.find((choice) => {
    if (choice.correct === true) {
      return choice;
    }
  });

  return el.dataset.id == correctAnswer.id ? true : false;
}
