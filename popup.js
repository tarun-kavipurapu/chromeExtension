const minutes = document.getElementById("minutes");
const time = document.getElementById("time");
const start = document.getElementById("start");
const reset = document.getElementById("reset");
//////////////////////////////////////////////////////
const pomodoro = document.getElementById("pomodoro");
const todo = document.getElementById("todo");
const blocker = document.getElementById("blocker");
////////////////////////////////////////////////////////
const pomodoroSec = document.getElementById("pomodoroSec");
const blockerSec = document.getElementById("blockerSec");
const todoSec = document.getElementById("todoSec");
////////////////////////////////////////////////////////

function show(sectiontoShow) {
  pomodoroSec.classList.add("hidden");
  blockerSec.classList.add("hidden");
  todoSec.classList.add("hidden");

  document.getElementById(sectiontoShow).classList.remove("hidden");
}

pomodoro.addEventListener("click", () => {
  show("pomodoroSec");
});

blocker.addEventListener("click", () => {
  show("blockerSec");
});

todo.addEventListener("click", () => {
  show("todoSec");
});
////////////////////////////////////////////////////////

start.addEventListener("click", () => {
  if (minutes) {
    const timeValue = minutes.value || "25:00";
    const timerContent = MMSSDisplay(inSeconds(timeValue));
    time.textContent = timerContent;
    chrome.runtime.sendMessage({
      action: "start",
      time: inSeconds(timeValue),
    });
    start.disabled = true;
    reset.disabled = false;
    chrome.storage.local
      .set({ startDisabled: true, resetDisabled: false })
      .then(() => {
        console.log("StartDisabled and resetEnabled");
      });
  }
});

reset.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "reset" });
  start.disabled = false;
  reset.disabled = true;
  chrome.storage.local
    .set({ startDisabled: false, resetDisabled: true })
    .then(() => {
      console.log("resetDisabled and startEnabled");
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateTimer" && time.textContent) {
    time.textContent = MMSSDisplay(message.time);
  }
});

chrome.storage.local.get(["startDisabled", "resetDisabled"]).then((data) => {
  start.disabled = data.startDisabled;
  reset.disabled = data.resetDisabled;
});

function MMSSDisplay(time) {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
function inSeconds(minutes) {
  return parseInt(minutes) * 60;
}

// console.log(MMSSDisplay(parseInt(time.textContent) * 60));
