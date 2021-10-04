// Code Quiz Questions [{}]
const questions = [
  {
    id: 1,
    question: "What is not a JavaScript data type?",
    choices: [
      { id: 1, answer: "string", value: false },
      { id: 2, answer: "var", value: true },
      { id: 3, answer: "object", value: false },
      { id: 4, answer: "undefined", value: false },
    ],
  },
  {
    id: 2,
    question: "What key word is not a valid way to declare a variable?",
    choices: [
      { id: 1, answer: "const", value: false },
      { id: 2, answer: "var", value: false },
      { id: 3, answer: "let", value: false },
      { id: 4, answer: "func", value: true },
    ],
  },
  {
    id: 3,
    question: "Are Java and JavaScript related?",
    choices: [
      { id: 1, answer: "Yes", value: false },
      { id: 2, answer: "No", value: true },
      {
        id: 3,
        answer: "Yes. Before 2000 they were cousins",
        value: false,
      },
      {
        id: 4,
        answer: "No. After 2000 they separated",
        value: false,
      },
    ],
  },
  {
    id: 4,
    question: "JavaScript document cookies are all of the following, except?",
    choices: [
      { id: 1, answer: "Tasty edibles", value: true },
      { id: 2, answer: "Cookies are data", value: false },
      {
        id: 3,
        answer: "Cookies are stored in small text files",
        value: false,
      },
      {
        id: 4,
        answer: "Cookies are stored on your computer",

        value: false,
      },
    ],
  },
];

// HTML elements to quickly hook into
const highScoresContainer = document.getElementById("highScoresContainer");
const quizContainer = document.getElementById("quizContainer");

const quizEl = document.getElementById("quiz");
const timerEl = document.getElementById("clock");
const quizQuestionEl = document.querySelector("h2#question");
const quizQuestionOlEl = document.querySelector("#quizContainer ol");
const scoreBoardEl = document.getElementById("scoreBoard");
const highScoresListOlEl = document.querySelector("#highScoresContainer ol");

const recordScoreForm = document.getElementById("recordScoreForm");

const startBtn = document.getElementById("start");
const quizNextQuestionBtn = document.getElementById("next");
const recordScoreBtn = document.getElementById("recordScore");
const highScoresBtn = document.getElementById("highScoresBtn");
const backToQuizBtn = document.getElementById("backToQuizBtn");
const cancelRecordScoreBtn = document.getElementById("cancelRecordScoreBtn");

// current state variables
let correctTotal;
let currentQuestion;
let timeInterval;
let quizTime;
let timePenalties;
let latestRadioClick;
let penaltyTime;
let timer;
let score;

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
  scoreBoardEl.innerHTML = "";
  timerEl.textContent = "";
  recordScoreBtn.style.display = "none";
  recordScoreForm.style.display = "none";
}

// Event listeners
// is the start/restart quiz button clicked?
startBtn.addEventListener("click", startBtnClickHandler);

// next question button clicked?
quizNextQuestionBtn.addEventListener("click", quizNextQuestionBtnClickHandler);

// record score button
recordScoreBtn.addEventListener("click", recordScoreBtnClickHandler);

// is view high scores button clicked?
highScoresBtn.addEventListener("click", highScoresBtnClickHandler);

// is back to quiz button clicked?
backToQuizBtn.addEventListener("click", backToQuizBtnClickHandler);

// cancel record score button
cancelRecordScoreBtn.addEventListener(
  "click",
  cancelRecordScoreBtnClickHandler
);

// is a radio button clicked?
quizEl.addEventListener("click", quizElClickHandler);

// start quiz button clicked - initialize quiz & scoreboard, show quiz, start timer
function startBtnClickHandler() {
  initializeQuiz();
  initializeScoreBoard();
  startBtn.style.display = "none";
  quizEl.style.display = "block";
  presentQuestion();
  stopWatch();
}

// next question button clicked
function quizNextQuestionBtnClickHandler() {
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
}

// display the record score form
function recordScoreBtnClickHandler() {
  recordScoreForm.style.display = "block";
  recordScoreBtn.style.display = "none";
  startBtn.style.display = "none";
}

// view high scores button clicked - show high scores, hide quiz
function highScoresBtnClickHandler() {
  const highScores = getHighScores();
  backToQuizBtn.style.display = "block";
  quizContainer.style.display = "none";
  highScoresBtn.style.display = "none";
  highScoresContainer.style.display = "block";
  if (!highScores) {
    highScoresListOlEl.innerHTML = "<li>No high scores have been recorded</li>";
    return;
  }

  const numberOfScoresToDisplay =
    highScores.length < 10 ? highScores.length : 10;
  highScoresListOlEl.innerHTML = "<li><p>Rank</p><p>Score</p><p>Name</p></li>";
  for (let i = 0; i < numberOfScoresToDisplay; i++) {
    let gameHTML = getScoreHTML(highScores[i], i + 1);
    console.log(gameHTML);
    highScoresListOlEl.appendChild(gameHTML);
  }
}

// back to quiz button clicked - hide high scores, show quiz
function backToQuizBtnClickHandler() {
  quizContainer.style.display = "block";
  highScoresContainer.style.display = "none";
  highScoresBtn.style.display = "block";
  backToQuizBtn.style.display = "none";
}

// hide the record score form
function cancelRecordScoreBtnClickHandler() {
  recordScoreForm.style.display = "none";
  recordScoreBtn.style.display = "block";
  startBtn.style.display = "block";
}

// check if radio button was clicked, enable next question button
function quizElClickHandler(event) {
  const element = event.target;
  // check if click matches a input type radio button
  if (element.matches("input[type='radio']")) {
    latestRadioClick = element;
    quizNextQuestionBtn.disabled = false;
  }
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

// simple writeTimer function since called in multiple places
function writeTimer() {
  timerEl.textContent = `Time left: ${timer.toFixed(1)}`;
}

function presentQuestion() {
  if (isMoreQuestions() === false) {
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
    if (choice.value === true) {
      return true;
    }
  });
  return el.dataset.id == correctAnswer.id ? true : false;
}

// returns boolean if no more question, stops timer & calls gameOver if false
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
    return false;
  }
  // we are not done with questions
  return true;
}

function getScoreHTML(game, rank) {
  let gameHTML = document.createElement("li");
  gameHTML.innerHTML = `<p>${rank}</p><p>${game.score.toFixed(1)}</p><p>${
    game.name
  }</p>`;
  return gameHTML;
}

// game over - hide quiz - display quiz stats
function gameOver() {
  startBtn.innerText = "Restart Quiz?";
  quizEl.style.display = "none";
  if (timer <= 0) {
    timer = 0;
    const timedOut = document.createElement("p");
    timedOut.textContent = "Time expired";
  }

  // display total answered
  const pAnswered = document.createElement("p");
  pAnswered.textContent = `Answered: ${currentQuestion} / ${questions.length}`;
  scoreBoardEl.appendChild(pAnswered);

  // display total correct
  const pCorrect = document.createElement("p");
  pCorrect.textContent = `Correct: ${correctTotal}`;
  scoreBoardEl.appendChild(pCorrect);

  // display total time penalties
  const pTimePenalties = document.createElement("p");
  pTimePenalties.textContent = `Penalties: ${timePenalties}, subtracted ${
    timePenalties * penaltyTime
  } seconds`;
  scoreBoardEl.appendChild(pTimePenalties);

  // display calculated score
  const pScore = document.createElement("p");
  score = correctTotal + timer * correctTotal - timePenalties;
  pScore.innerHTML = `<strong>${score.toFixed(1)}</strong>`;
  pScore.setAttribute("title", `${score}`);
  pScore.setAttribute("id", "quizScore");
  scoreBoardEl.appendChild(pScore);

  const pScoreDefinition = document.createElement("p");
  pScoreDefinition.setAttribute("class", "small");
  pScoreDefinition.innerHTML = `Score calculated by: correct + (time left * correct) - wrong`;
  scoreBoardEl.appendChild(pScoreDefinition);

  recordScoreBtn.style.display = "block";
  startBtn.style.display = "block";
}

// record score to local storage
function recordScore(event) {
  event.preventDefault();
  const initials = document.querySelector('input[name="initials"]').value;

  // gather score to save
  const scoreObj = {
    score: score,
    correct: correctTotal,
    name: initials.toUpperCase(),
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
  highScores.push(scoreObj);

  // add new quiz score to local storage
  window.localStorage.setItem("highScores", JSON.stringify(highScores));

  // hide form, update start button text for current tense, show start button
  recordScoreForm.style.display = "none";
  startBtn.innerText = "Restart Quiz?";
  startBtn.style.display = "block";
}

function getHighScores() {
  let highScores = JSON.parse(localStorage.getItem("highScores"));
  // sort highScores by score
  if (highScores) {
    highScores = highScores.sort(function (a, b) {
      // sort descending
      return b.score - a.score;
    });
  }
  return highScores;
}
