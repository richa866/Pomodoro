const pomodoroName = document.querySelector(".pomodoroName");
const currentCycle = document.querySelector(".displayCurrentCycle");
const modal = document.querySelector(".modal");
const yes = document.querySelector(".yes");
const no = document.querySelector(".no");
const start = document.querySelector(".start");
const stop = document.querySelector(".stop");
const pause = document.querySelector(".pause");
const progressValue = document.querySelector(".progressValue");
const viewList = document.querySelector(".view");
const displayList = document.querySelector(".displayList");
const ul = document.querySelector("ul");
const rounds = document.querySelector(".rounds");
const submit = document.querySelector(".Submit");
const cancel = document.querySelector(".cancel");
let newPTime = document.querySelector(".cycleTime");
let newBTime = document.querySelector(".break");

let pomodoroTime = 1 * 60;
let breakTime = 0.5 * 60;
let userPomodoroTime = 1 * 60;
let userBreakTime = 0.5 * 60;
let multFact = 360 / pomodoroTime; //remember to add this in css
let timeInterval = null;
let roundCompleted = false;
let resetDone = false;

const tasks = [];
let count = 0;
let breakStopped = false;
let pomodoroStopped = false;
let paused = false;

const stopTimer = () => {
  clearInterval(timeInterval);
  timeInterval = null;
};

//updating the list
const updateList = (taskName, roundsCompleted) => {
  let li = document.createElement("li"); // Create a list item
  li.classList.add("taskItem");
  li.innerHTML = `Task: ${taskName}  Rounds Completed: ${roundsCompleted}`;
  ul.appendChild(li);
  // Append the list item to the unordered list
};

//formatting time display
function formatingDisplay(number) {
  const minutes = Math.trunc(number / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.trunc(number % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}: ${seconds}`;
}

//ALLOWING THE USER TO NAME THEIR POMODOROS
pomodoroName.addEventListener("dblclick", () => {
  pomodoroName.innerHTML = ""; // clearing the previous value
  let newName = document.createElement("input");
  newName.classList.add("newName");
  newName.value = pomodoroName.innerText; // new value = in the old value
  pomodoroName.appendChild(newName);
  newName.style.cssText =
    "background-color: transparent; font-size: 1.8rem; color: white;";
  newName.addEventListener("blur", () => {
    pomodoroName.innerText = newName.value; // again changing the value
  });
  console.log(tasks);
});

// START POMODORO
const startPomodoro = () => {
  if (!timeInterval) {
    timeInterval = setInterval(() => {
      if (!paused) {
        pomodoroTime--;
        countdown();
        if (pomodoroTime <= 0) {
          stopTimer();
          startBreak(); // Start the break timer
        }
      }
    }, 1000);
  }
};

//START BREAK
const startBreak = () => {
  if (timeInterval) clearInterval(timeInterval);
  breakTime = 0.5 * 60;
  currentCycle.textContent = "BREAK";
  roundCompleted = true; // Mark round as completed
  timeInterval = setInterval(() => {
    breakTime--;
    countdown();
    if (breakTime <= 0) {
      stopTimer();
      resetPomodoro(); // Reset for the next Pomodoro
    }
  }, 1000);
};

// Pause Pomodoro
const pausePomodoro = () => {
  stopTimer();
  paused = true;
};

//STOP POMODORO
const stopPomodoro = () => {
  stopTimer();
  progressValue.textContent = "25:00";
  pomodoroTime = 1 * 60; // Reset the pomodoro time
  console.log("pomooro stopped");
};
//null signifies that no timer is running.
// It prevents starting multiple timers when you click start multiple times.
// It helps manage the state of your timer logic cleanly.

//COUNTDOWN FUNCTION
const countdown = () => {
  if (pomodoroTime === 0 && currentCycle.textContent !== "BREAK") {
    stopTimer();
    console.log("pomodorotime is 0");
    startBreak();
  }

  // to prevent negative values
  if (pomodoroTime < 0) pomodoroTime = 0;
  if (breakTime < 0) breakTime = 0;

  progressValue.textContent =
    currentCycle.textContent === "BREAK"
      ? formatingDisplay(breakTime)
      : formatingDisplay(pomodoroTime);
};

// to prevent negative values
if (pomodoroTime < 0) pomodoroTime = 0;
if (breakTime < 0) breakTime = 0;

start.addEventListener("click", () => {
  paused = false; // after pausing when you click on the start button again , it resets the flag to false , allowing to continue the countdwn
  startPomodoro();
  if (roundCompleted) resetPomodoro();
});

stop.addEventListener("click", () => {
  stopPomodoro();
  if (currentCycle.textContent === "BREAK") {
    breakTime = 0.5 * 60;
    breakStopped = true;
  } else if (currentCycle.textContent === "POMODORO") {
    pomodoroTime = 1 * 60;
    pomodoroStopped = true;
  }
});

pause.addEventListener("click", () => {
  pausePomodoro();
  paused = true;
});

const roundCount = (nameOfTask) => {
  let taskFound = false;

  tasks.forEach((task) => {
    if (task.name === nameOfTask) {
      task.rounds++;
      count = task.rounds; // Update count based on task rounds
      taskFound = true;
    }
  });

  if (!taskFound) {
    count = 1;
    tasks.push({ name: nameOfTask, rounds: count });
  }

  updateList(nameOfTask, count);
  rounds.textContent = `Rounds completed: ${count}`;
};
//RESETTING ALL THE VALUES AND UPDATING THEM IN THE LIST
const resetPomodoro = () => {
  if (roundCompleted == false) return;
  console.log("entereed the reset loop");
  roundCompleted = false;
  paused = false;
  timeInterval = null;
  pomodoroTime = userPomodoroTime;
  breakTime = userBreakTime;
  clearInterval(timeInterval);
  currentCycle.textContent = "POMODORO";
  progressValue.textContent = formatingDisplay(pomodoroTime);
  roundCount(pomodoroName.textContent);
  console.log(
    `Reset completed - Pomodoro: ${pomodoroTime}s, Break: ${breakTime}s, Rounds: ${count}`
  );
};
progressValue.addEventListener("dblclick", () => {
  modal.style.display = "block";
});
submit.addEventListener("click", () => {
  changeTime(newPTime.value, newBTime.value);
  modal.style.display = "none";
});
const changeTime = (newPTime, newBTime) => {
  userPomodoroTime = parseInt(newPTime, 10) * 60;
  userBreakTime = parseInt(newBTime, 10) * 60;
  pomodoroTime = userPomodoroTime;
  breakTime = userBreakTime;
  progressValue.textContent = formatingDisplay(pomodoroTime);
};
cancel.addEventListener("click", () => {
  modal.style.display = "none";
});
