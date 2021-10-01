const questions = [
  {
    id: 1,
    question: "Are you a student?",
    choices: [
      { answer: "Yes", value: "Y", correct: true },
      { answer: "No", value: "N", correct: false },
      { answer: "Maybe", value: "M", correct: false },
      { answer: "I don't understand", value: "X", correct: false },
    ],
  },
  {
    id: 2,
    question: "Is JavaScript Java?",
    choices: [
      { answer: "Yes", value: "Y", correct: false },
      { answer: "No", value: "N", correct: true },
      { answer: "Maybe", value: "M", correct: false },
      { answer: "I don't understand", value: "X", correct: false },
    ],
  },
];

const correctTotal = 0;

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
quizEl.addEventListener("click", function () {
  const radioChecked = document.querySelectorAll('input[type="radio"]:checked');
  if (radioChecked.length > 0) {
    quizButton.disabled = false;
  }
});

quizButton.addEventListener("click", function () {
  currentQuestion++;
  this.disabled = true;
  presentQuestion();
});
