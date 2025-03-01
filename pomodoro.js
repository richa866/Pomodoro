//accessing elements from html
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
//default values
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
let taskFound = false;

progressValue.textContent = formatingDisplay(pomodoroTime);

//STOP TIMER
const stopTimer = () => {
  clearInterval(timeInterval);
  timeInterval = null;
  //null signifies that no timer is running.
  // It prevents starting multiple timers when you click start multiple times.
};

//UPDATING LIST
const updateList = (taskName, roundsCompleted) => {
  let existingTask = Array.from(ul.querySelectorAll("li")).find((li) =>
    li.textContent.startsWith(`Task: ${taskName} |`)
  );

  if (existingTask) {
    existingTask.textContent = `Task: ${taskName} | Rounds Completed: ${roundsCompleted}`;
  } else {
    let li = document.createElement("li");
    li.classList.add("taskItem");
    li.textContent = `Task: ${taskName} | Rounds Completed: ${roundsCompleted}`;
    ul.appendChild(li);
  }
};
//CHANGE TIME ACCORDING TO THE USER CHOICE
const changeTime = (newPTime, newBTime) => {
  userPomodoroTime = Math.round(parseFloat(newPTime, 10) * 60);
  userBreakTime = Math.round(parseFloat(newBTime, 10) * 60);
  //using parseInt as it ignores the decimals
  pomodoroTime = userPomodoroTime;
  breakTime = userBreakTime;
  progressValue.textContent = formatingDisplay(pomodoroTime);
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
  newName.value = pomodoroName.innerText;
  pomodoroName.appendChild(newName);
  newName.style.cssText =
    "background-color: transparent; font-size: 1.8rem; color: #7b2cbf;";
  newName.addEventListener("blur", () => {
    if (newName.value.trim() === "") {
      pomodoroName.innerText = "POMODORO";
    } else {
      pomodoroName.innerText = newName.value;
    }
  });
});

const startPomodoro = () => {
  if (!timeInterval) {
    timeInterval = setInterval(() => {
      if (!paused) {
        if ((currentCycle.value = "POMODORO" && pomodoroTime > 0)) {
          pomodoroTime--;
          countdown();
          console.log("IN LOOP pom>0");
        } else {
          stopTimer();
          setTimeout(startBreak, 1000);
          console.log("called break");
          //calls the break function once the pomodoro ends
        }
      }
    }, 1000);
  }
};

//START BREAK
const startBreak = () => {
  if (timeInterval) clearInterval(timeInterval);
  //if time interval is set clears it
  currentCycle.textContent = "BREAK";
  //changes the display
  console.log("entered the start break loop");
  timeInterval = setInterval(() => {
    if (!paused) {
      if (breakTime > 0) {
        breakTime--;
        countdown();
        console.log("entered the b>0");
      } else {
        stopTimer();
        roundCompleted = true;
        resetPomodoro();
      }
    }
  }, 1000);
};

// Pause Pomodoro
const pausePomodoro = () => {
  stopTimer(); //clears the interval
  paused = true; //sets the flag true
  console.log("paused");
};

const stopPomodoro = () => {
  console.log("Entered stop pom loop");
  stopTimer();
  pomodoroTime = userPomodoroTime;
  breakTime = userBreakTime;
  if (currentCycle.textContent === "BREAK") {
    breakStopped = true;
  } else {
    pomodoroStopped = true;
  }
  resetPomodoro();
  console.log("called the reset");
};
//COUNTDOWN FUNCTION
const countdown = () => {
  if (pomodoroTime === 0 && currentCycle.textContent !== "BREAK") {
    stopTimer(); //clears the interval
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

const roundCount = (nameOfTask) => {
  let task = tasks.find(
    (task) => task.name.toLowerCase() === nameOfTask.toLowerCase()
  );
  if (task) {
    task.rounds++; // Increment existing task
    console.log("Task found:", task.name, task.rounds);
    nameOfTask = task.name; // Keep original casing
    taskFound = true;
  } else {
    console.log("Task not found, adding:", nameOfTask);
    task = { name: nameOfTask, rounds: 1 }; // Add new task with the first entered casing
    tasks.push(task);
  }

  updateList(task.name, task.rounds); // Use the stored task name
  rounds.textContent = `Rounds completed: ${task.rounds}`;
};

const resetPomodoro = () => {
  console.log("entereed the reset loop");
  if (roundCompleted || breakStopped || pomodoroStopped) {
    console.log("checked cond");
    roundCompleted = false;
    paused = false;
    pomodoroTime = userPomodoroTime;
    breakTime = userBreakTime;
    clearInterval(timeInterval);
    timeInterval = null;
    currentCycle.textContent = "POMODORO";
    progressValue.textContent = formatingDisplay(pomodoroTime);
    if (!pomodoroStopped || breakStopped) {
      roundCount(pomodoroName.textContent);
    }
    Stopped = false;

    console.log(
      `Reset completed - Pomodoro: ${pomodoroTime}s, Break: ${breakTime}s, Rounds: ${count}`
    );
  }
};

// to prevent negative values
if (pomodoroTime < 0) pomodoroTime = 0;
if (breakTime < 0) breakTime = 0;

start.addEventListener("click", () => {
  console.log("start");
  paused = false;
  breakStopped = pomodoroStopped = false;
  // if paused sets the flag to false
  if (currentCycle.textContent === "BREAK") {
    startBreak();
    //when the break is paused and the start button is clicked resumes the break
  } else {
    startPomodoro();
    //starts/resumes the pomodoro depending on the case
  }
  if (roundCompleted) resetPomodoro();
  //calls the reset function if the round is completed
});

stop.addEventListener("click", () => {
  stopPomodoro();
  console.log("stopped");
});

pause.addEventListener("click", () => {
  pausePomodoro();
});

//RESETTING ALL THE VALUES AND UPDATING THEM IN THE LIST

progressValue.addEventListener("dblclick", () => {
  modal.style.display = "block";
});
submit.addEventListener("click", () => {
  changeTime(newPTime.value, newBTime.value);
  modal.style.display = "none";
});

cancel.addEventListener("click", () => {
  modal.style.display = "none";
});
