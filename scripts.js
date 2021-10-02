// Code Quiz Questions [{}]
const questions = [
  {
    id: 1,
    question: "How do you declare a variable that will be hoisted?",
    choices: [
      { id: 1, answer: "const", correct: false },
      { id: 2, answer: "var", correct: true },
      { id: 3, answer: "let", correct: false },
      { id: 4, answer: "function", correct: false },
    ],
  },
  {
    id: 2,
    question: "How do you declare a function that will be hoisted?",
    choices: [
      { id: 1, answer: "const", correct: false },
      { id: 2, answer: "var", correct: false },
      { id: 3, answer: "let", correct: false },
      { id: 4, answer: "function", value: "f", correct: true },
    ],
  },
  {
    id: 3,
    question: "Are Java and JavaScript related?",
    choices: [
      { id: 1, answer: "Yes", value: "Y", correct: false },
      { id: 2, answer: "No", value: "N", correct: true },
      {
        id: 3,
        answer: "Yes. Before 2000 they were cousins",
        correct: false,
      },
      {
        id: 4,
        answer: "No. After 2000 they separated",
        correct: false,
      },
    ],
  },
];

// HTML elements to quickly hook into
const startBtn = document.getElementById("start");
const quizEl = document.getElementById("quiz");
const quizNextQuestionBtn = document.getElementById("next");
const quizCompleteEl = document.getElementById("quizComplete");
const timerEl = document.getElementById("clock");
const recordScoreBtn = document.getElementById("recordScore");
const scoreBoard = document.getElementById("scoreBoard");
const recordScoreForm = document.getElementById("recordScoreForm");
const quizQuestionEl = document.querySelector("h2");
const quizQuestionOlEl = document.querySelector("#quizContainer ol");
const highScoresBtn = document.getElementById("highScoresBtn");
const backToQuizBtn = document.getElementById("backToQuizBtn");
const highScoresContainer = document.getElementById("highScoresContainer");
const quizContainer = document.getElementById("quizContainer");
const highScoresList = document.querySelector("#highScoresContainer ol");

// current state variables
let correctTotal;
let currentQuestion;
let timeInterval;
let quizTime;
let timePenalties;
let latestRadioClick;
let penaltyTime;
let timer = quizTime;

// initialize Quiz
function initializeQuiz() {
  correctTotal = 0;
  currentQuestion = 0;
  timeInterval;
  quizTime = 30.0;
  timePenalties = 0;
  latestRadioClick = undefined;
  timer = quizTime;
  penaltyTime = 5.0;
}

// initialize Scoreboard
function initializeScoreBoard() {
  scoreBoard.innerHTML = "";
  timerEl.textContent = "";
  recordScoreBtn.style.display = "none";
  recordScoreForm.style.display = "none";
}

// timer
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
    writeTimer();
  }, 100);
}

// game over - hide quiz - display quiz stats
function gameOver() {
  startBtn.innerText = "Restart Quiz?";
  quizEl.style.display = "none";
  if (timer <= 0) {
    timer = 0;
    const timedOut = document.createElement("p");
    timedOut.textContent = "Time expired";
    quizCompleteEl.appendChild(timedOut);
  }

  // display total answered
  const pAnswered = document.createElement("p");
  pAnswered.textContent = `Answered: ${currentQuestion} / ${questions.length}`;
  scoreBoard.appendChild(pAnswered);

  // display total correct
  const pCorrect = document.createElement("p");
  pCorrect.textContent = `Correct: ${correctTotal}`;
  scoreBoard.appendChild(pCorrect);

  // display total time penalties
  const pTimePenalties = document.createElement("p");
  pTimePenalties.textContent = `Penalties: ${timePenalties}, subtracted ${
    timePenalties * penaltyTime
  } seconds`;
  scoreBoard.appendChild(pTimePenalties);

  recordScoreBtn.style.display = "block";
  startBtn.style.display = "block";
}

// record score button
recordScoreBtn.addEventListener("click", function () {
  displayRecordScoreForm();
});

// display the record score form
function displayRecordScoreForm() {
  recordScoreForm.style.display = "block";
  recordScoreBtn.style.display = "none";
  startBtn.style.display = "none";
}

// record score to local storage
function recordScore(event) {
  event.preventDefault();
  const initials = document.querySelector('input[name="initials"]').value;
  const quizScore = correctTotal + timer - timePenalties;

  // gather score to save
  const score = {
    score: quizScore,
    correct: correctTotal,
    name: initials,
    date: Date.now(),
    penalties: timePenalties,
    timeLeft: timer,
  };

  // create highScores array to store data
  let highScores = [];

  // add data from locate storage to highScores array
  const storageScores = JSON.parse(localStorage.getItem("highScores"));
  if (storageScores) {
    storageScores.forEach((score) => {
      highScores.push(score);
    });
  }

  // add current quiz to highScores array
  highScores.push(score);

  // add new quiz score to local storage
  window.localStorage.setItem("highScores", JSON.stringify(highScores));

  // hide form, update start button text for current tense, show start button
  recordScoreForm.style.display = "none";
  startBtn.innerText = "Restart Quiz?";
  startBtn.style.display = "block";
}

function isMoreQuestions() {
  // are we done with questions? If yes, let hop in
  if (currentQuestion >= questions.length) {
    // stop the timer
    clearInterval(timeInterval);
    if (timer < 0) {
      timer = 0;
    }
    // update the timer for user
    writeTimer();
    quizEl.style.display = "none";

    // it's over, call gameOver
    gameOver();
    return true;
  }
  // we are not done with questions
  return false;
}

function presentQuestion() {
  if (isMoreQuestions() === true) {
    // no more questions or time's up, isQuestionsDone() says we are done - let's jump out
    return;
  }
  // we have a question - let's ask it
  quizQuestionEl.innerHTML = questions[currentQuestion].question;
  // remove any previous choices listed
  quizQuestionOlEl.innerHTML = "";
  // list the current question choices
  listChoices();
}

// based on currentQuestion, list the question choices,
function listChoices() {
  for (let i = 0; i < questions[currentQuestion].choices.length; i++) {
    // create the list element
    let choice = document.createElement("li");

    // create the radio form elements
    let radio = document.createElement("input");
    let label = document.createElement("label");

    // populate radio element
    radio.dataset.id = questions[currentQuestion].choices[i].id;
    radio.dataset.questionId = currentQuestion;
    radio.type = "radio";
    radio.value = questions[currentQuestion].choices[i].value;
    radio.name = "question" + (currentQuestion + 1);
    radio.id = "answer" + (i + 1);

    // populate label element
    label.htmlFor = "answer" + (i + 1);
    label.innerHTML = questions[currentQuestion].choices[i].answer;

    quizQuestionOlEl.appendChild(choice);
    choice.appendChild(radio);
    choice.appendChild(label);
  }
}

// check if the answer is correct - return true or false
function checkAnswer(el) {
  const questionId = el.dataset.questionId;
  const correctAnswer = questions[questionId].choices.find((choice) => {
    if (choice.correct === true) {
      return true;
    }
  });
  return el.dataset.id == correctAnswer.id ? true : false;
}

// Event listeners
// is a radio answer button clicked?
quizEl.addEventListener("click", function (event) {
  const element = event.target;
  // check if click matches a input type radio button
  if (element.matches("input[type='radio']")) {
    latestRadioClick = element;
    quizNextQuestionBtn.disabled = false;
  }
});

// is the start/restart quiz button clicked?
startBtn.addEventListener("click", function () {
  initializeQuiz();
  initializeScoreBoard();
  startBtn.style.display = "none";
  quizEl.style.display = "block";
  presentQuestion();
  stopWatch();
});

// next question button clicked?
quizNextQuestionBtn.addEventListener("click", function () {
  if (checkAnswer(latestRadioClick) === true) {
    correctTotal++;
  } else {
    // time penalty
    timer = timer - penaltyTime > 0 ? timer - penaltyTime : 0;
    if (timer === 0) {
      writeTimer();
    }
    timePenalties++;
  }
  // proceed to the next question
  currentQuestion++;
  this.disabled = true;
  presentQuestion();
});

// simple writeTimer function since called in multiple places
function writeTimer() {
  timerEl.textContent = `Time left: ${timer.toFixed(1)}`;
}

function getHighScores() {
  let highScores = JSON.parse(localStorage.getItem("highScores"));
  // sort highScores by score
  if (highScores) {
    highScores = highScores.sort(function (a, b) {
      return b.score - a.score;
    });
  }
  return highScores;
}
highScoresBtn.addEventListener("click", showHighScores);

function showHighScores() {
  const highScores = getHighScores();
  if (!highScores) {
    highScoresList.innerHTML = "<li>No high scores have been recorded</li>";
    return;
  }
  backToQuizBtn.style.display = "block";
  quizContainer.style.display = "none";
  highScoresBtn.style.display = "none";
  const numberOfScoresToDisplay =
    highScores.length < 10 ? highScores.length : 10;
  highScoresList.innerHTML = "<li><p>Rank</p><p>Score</p><p>Name</p></li>";
  for (let i = 0; i < numberOfScoresToDisplay; i++) {
    let gameHTML = getScoreHTML(highScores[i], i + 1);
    console.log(gameHTML);
    highScoresList.appendChild(gameHTML);
  }
  highScoresContainer.style.display = "block";
}

function getScoreHTML(game, rank) {
  let gameHTML = document.createElement("li");
  gameHTML.innerHTML = `<p>${rank}</p><p>${game.score.toFixed(1)}</p><p>${
    game.name
  }</p>`;
  return gameHTML;
}

backToQuizBtn.addEventListener("click", backToQuiz);
function backToQuiz() {
  quizContainer.style.display = "block";
  highScoresContainer.style.display = "none";
  highScoresBtn.style.display = "block";
  backToQuizBtn.style.display = "none";
}
