     
let pomodoroName=document.querySelector(".pomodoroName");
let currentCycle=document.querySelector(".displayCurrentCycle");
let modal=document.querySelector(".modal");
let yes =document.querySelector(".yes");
let no=document.querySelector(".no");
let start =document.querySelector(".start");
let stop =document.querySelector(".stop");
let pause=document.querySelector(".pause");
let progressValue=document.querySelector(".progressValue");
let viewList =document.querySelector(".view");
let displayList=document.querySelector(".displayList");
let ul=document.querySelector("ul");
let rounds= document.querySelector(".rounds");

const list=(taskName,roundsCompleted)=>{


 let li = document.createElement("li"); // Create a list item
    let taskDetails = document.createElement("span"); // Create a span for task name
    let roundsDetails = document.createElement("span"); // Create a span for rounds completed

    // Set text content for each part
    taskDetails.textContent = `Task: ${taskName}`;
    roundsDetails.textContent = `Rounds Completed: ${roundsCompleted}`;

    // Optional styling for better visual separation
    taskDetails.style.marginRight = "10px";
    roundsDetails.style.fontWeight = "bold";

    // Append the details to the list item
    li.appendChild(taskDetails);
    li.appendChild(roundsDetails);

    // Append the list item to the unordered list
    ul.appendChild(li);

}
let tasks=[];
//ALLOWING THE USER TO NAME THEIR POMODOROS
pomodoroName.addEventListener("dblclick",()=>{

    pomodoroName.innerHTML = "";    // clearing the previous value
    let newName= document.createElement("input");
    newName.classList.add("newName");
    newName.value= pomodoroName.innerText;              // new value = in the old value
    pomodoroName.appendChild(newName);
    // tasks.push(pomodoroName.innerHTML);

    newName.style.backgroundColor="transparent";
    newName.style.fontSize="1.8rem";
    newName.style.color="white";

    newName.addEventListener("blur",()=>{
        pomodoroName.innerText=newName.value;             // again changing the value
        
    })
    console.log(tasks);
}
)



//CREATING THE POMODORO

//GIVING THE TIMES
let pomodoroTime = 1*60;
let breakTime=0.5*60; 
let multFact=360/pomodoroTime;       //remember to add this in css
let timeInterval=null;
let roundCompleted=false;
let resetDone =  false;


function formatingDisplay(number){
    const minutes =Math.trunc(number/60).toString().padStart(2,"0");
    const seconds =Math.trunc(number%60).toString().padStart(2,"0");

    return`${minutes}: ${seconds}`;
}

const startPomodoro = () => {
    if (!timeInterval) {
        timeInterval = setInterval(() => {
            if (!paused) {
                pomodoroTime--;
                countdown();
                if (pomodoroTime <= 0) {
                    clearInterval(timeInterval);
                    timeInterval = null;
                    breakStarts(); // Start the break timer
                }
            }
        }, 1000);
    }
};

const breakStarts = () => {
    if (timeInterval) clearInterval(timeInterval);
    breakTime = 0.5 * 60;
    currentCycle.textContent = "BREAK";
    roundCompleted = true; // Mark round as completed

    timeInterval = setInterval(() => {
        breakTime--;
        countdown();
        if (breakTime <= 0) {
            clearInterval(timeInterval);
            timeInterval = null;
            reset(); // Reset for the next Pomodoro
        }
    }, 1000);
};


const pausePomodoro=()=>{
    clearInterval(timeInterval);     // stops an ongoing function 
    timeInterval=null
    console.log("pomooro paused");
}

let breakStopped= false;
let pomodoroStopped= false;
const stopPomodoro=()=>{
    
    clearInterval(timeInterval); 
    timeInterval=null;                                  //null signifies that no timer is running.
                                                        // It prevents starting multiple timers when you click start multiple times.
                                                         // It helps manage the state of your timer logic cleanly.
    progressValue.textContent= "25:00";
    pomodoroTime = 1 * 60; // Reset the pomodoro time
    console.log("pomooro stopped");
}
const countdown=()=>{

    if(pomodoroTime===0 && currentCycle.textContent!=="BREAK"){
        clearInterval(timeInterval);
        timeInterval=null;
        console.log("pomodorotime is 0");
        breakStarts();
        
    }

    else if(breakTime===0 ){
        
        clearInterval(timeInterval);
        console.log("break is 0");
        reset();
        
    }
    // to prevent negative values
    if (pomodoroTime < 0) pomodoroTime = 0;
    if (breakTime < 0) breakTime = 0;
    

    progressValue.textContent = currentCycle.textContent === "BREAK" 
    ? formatingDisplay(breakTime) 
    : formatingDisplay(pomodoroTime);
}

start.addEventListener("click",()=>{
    paused=false;            // after pausing when you click on the start button again , it resets the flag to false , allowing to continue the countdwn
    startPomodoro();
    if(roundCompleted){
        reset();
    }
})

stop.addEventListener("click",()=>{
    stopPomodoro();
    if( currentCycle.textContent === "BREAK"){
        breakTime=0.5*60; 
        breakStopped=true;
    }
    else if(currentCycle.textContent === "POMODORO"){
        pomodoroTime = 1*60;  
        pomodoroStopped= true;
    }

})

let paused= false ;
pause.addEventListener("click",()=>{
    pausePomodoro(); 
    paused= true;     
})

let count =0;

//RESETTING ALL THE VALUES AND UPDATING THEM IN THE LIST
const reset=()=>{
if(roundCompleted==true){
console.log("entereed the reset loop");
pomodoroTime = 1*60;
 breakTime=0.5*60; 
clearInterval(timeInterval);
currentCycle.value = "POMODORO";
 progressValue.textContent = formatingDisplay(pomodoroTime);

 //RESETTING THE FLAGS
 roundCompleted=false;
 paused= false;
 
//COUNTING THE ROUNDS
count++;
console.log(count);
rounds.textContent= `Rounds completed: ${count}`;       //updating the value
tasks.push({ name: pomodoroName.textContent, rounds: count })
console.log(tasks);
list(pomodoroName.textContent, count);
console.log("Reset completed:", {
    pomodoroTime,
    breakTime,
    roundCompleted,
    paused,
    count,
});
    }
}













