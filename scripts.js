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

const startBtn = document.querySelector("#start");
const quizEl = document.querySelector("#quiz");
const quizButton = document.querySelector("#next");
const quizCompleteEl = document.querySelector("#quizComplete");
startBtn.addEventListener("click", function () {
  startBtn.style.display = "none";
  quizEl.style.display = "block";
  presentQuestion();
});

const h2Element = document.querySelector("h2");
const olElement = document.querySelector("ol");
let currentQuestion = 0;

function presentQuestion() {
  if (currentQuestion >= questions.length) {
    quizEl.style.display = "none";
    quizCompleteEl.style.display = "block";
    const score = document.createElement("p");
    score.innerHTML = correctTotal;
    quizCompleteEl.appendChild(score);
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
  currentQuestion++;
  this.disabled = true;
  presentQuestion();
});

quizEl.addEventListener("click", function (event) {
  const element = event.target;
  if (element.matches('input[type="radio"]')) {
    correctTotal = checkAnswer(element) ? correctTotal + 1 : correctTotal;
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
