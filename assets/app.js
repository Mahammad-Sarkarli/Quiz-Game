const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];

const CONTAINER = document.querySelector(".container");
const START_BTN = document.getElementById("start-btn");
const START_BOX = document.getElementById("start");
const LEADERBOARD = document.getElementById("leaderboard");
const HIGHSCORE_BOX = document.getElementById("high-score");
const TIME = document.getElementById("time");
const GO_BACK_BTN = document.getElementById("go-back");
const CLEAR_SCORES_BTN = document.getElementById("clear-scores");

eventListeners();

function eventListeners() {
  START_BTN.addEventListener("click", startQuizGame);
  LEADERBOARD.addEventListener("click", openLeaderBoard);
  GO_BACK_BTN.addEventListener("click", goToStart);
  CLEAR_SCORES_BTN.addEventListener("click", clearStorage);
}

function goToStart() {
  HIGHSCORE_BOX.parentElement.classList.remove("visible");
  START_BOX.classList.add("visible");
}

function clearStorage() {
  localStorage.clear();
  while (HIGHSCORE_BOX.firstElementChild !== null) {
    HIGHSCORE_BOX.firstElementChild.remove();
  }
}

function openLeaderBoard() {
  const BOXES = document.querySelectorAll(".box");
  const userList = getUserList();
  BOXES.forEach((box) => {
    box.classList.remove("visible");
  });
  if (userList.length > 0) {
    userList.forEach((user, index) => {
      HIGHSCORE_BOX.innerHTML += `
            <div class="user-data">
         ${index + 1}. <span class="name">${
        user.name
      } : </span> <span class="points">${user.points}</span> 
            </div >`;
    });
  }
  HIGHSCORE_BOX.parentElement.classList.add("visible");
}

function startQuizGame() {
  const firstQuestionIndex = 0;
  const currentPoints = 0;
  START_BOX.classList.remove("visible");
  startSecondomer();
  createQuestionBox(firstQuestionIndex, currentPoints);
}

function startSecondomer() {
  TIME.textContent = 60;
  let x = setInterval(() => {
    if (TIME.textContent - 1 > 0) {
      TIME.textContent -= 1;
    } else {
      TIME.textContent = "";
      clearInterval(x);
    }
  }, 1000);
}

function createQuestionBox(questionIndex, currentPoints) {
  const div = document.createElement("div");
  div.classList = "box visible";
  if (Number(TIME.textContent) > 0 && questionIndex < questions.length) {
    div.innerHTML = `<h3> ${questions[questionIndex].questionText} </h3 > `;

    for (let i = 0; i < questions[questionIndex].options.length; i++) {
      div.innerHTML = createAnswers(div, questionIndex, i);
    }
    CONTAINER.appendChild(div);
    eventListenerToNewQuestion(questionIndex, div, currentPoints);
  } else {
    div.innerHTML = `
            <h2>ALL DONE!</h2>
            <p>Your Score is: ${currentPoints} </p>
            <form id="username-form">
                <label>Enter your name: <label>
                <input type="text" id="username"/>
                <button class="btn">Submit</button>
            </form>
        `;
    TIME.textContent = 0;
    CONTAINER.appendChild(div);
    document
      .getElementById("username-form")
      .addEventListener("submit", (e) => saveUserData(e, currentPoints));
  }
}

function getUserList() {
  let userList = [];
  if (localStorage.getItem("users") !== null) {
    userList = JSON.parse(localStorage.getItem("users"));
  }
  return userList;
}

function saveUserData(e, reachedPoints) {
  const userList = getUserList();
  const username = document.getElementById("username").value;
  const user = { name: username, points: reachedPoints };
  userList.push(user);
  localStorage.setItem("users", JSON.stringify(userList));
  removeCreatedBoxes();
  openLeaderBoard();
  e.preventDefault();
}

function removeCreatedBoxes() {
  const BOXES = document.querySelectorAll(".box");

  for (let i = 2; i < BOXES.length; i++) {
    BOXES[i].remove();
  }
}

function createAnswers(currentBox, questionIndex, optionsIndex) {
  currentBox.innerHTML += `
    <button class="btn option">${questions[questionIndex].options[optionsIndex]}</button>`;
  return currentBox.innerHTML;
}

function eventListenerToNewQuestion(questionIndex, currentBox, currentPoints) {
  const OPTION_BUTTONS = document.querySelectorAll(".btn");
  const startIndex =
    questionIndex > 0 ? questions[questionIndex].options.length : 3;
  console.log(startIndex);
  for (let i = startIndex; i < OPTION_BUTTONS.length; i++) {
    console.log(OPTION_BUTTONS[i]);
    OPTION_BUTTONS[i].addEventListener("click", () =>
      checkAnswer(
        OPTION_BUTTONS[i].textContent,
        questionIndex,
        currentBox,
        currentPoints
      )
    );
  }
}

function checkAnswer(userAnswer, questionIndex, currentBox, currentPoints) {
  const correctAnswer = questions[questionIndex].answer;
  const box = document.querySelector(".box:last-child");
  const nextQuestionIndex = questionIndex + 1;

  if (userAnswer === correctAnswer) {
    box.innerHTML += "<p class='answer'>Correct</p>";
    currentPoints += 10;
  } else if (userAnswer !== correctAnswer) {
    TIME.textContent -= 10;
    currentPoints -= 5;
    box.innerHTML += "<p class='answer'>False</p>";
  }

  setTimeout(() => {
    currentBox.classList.remove("visible");
    createQuestionBox(nextQuestionIndex, currentPoints);
  }, 1000);
}
