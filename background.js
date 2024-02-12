let timerRunning = false;
function startTimer(timeRemaining) {
  timerRunning = true;
  // chrome.port.postMessage({ action: "timerStarted" }); // Inform popup

  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      chrome.runtime.sendMessage({
        action: "updateTimer",
        time: timeRemaining,
      });
    } else {
      clearInterval(timerInterval);
    }
  }, 1000); // Update every second
}

function reset() {
  timerRunning = false;

  clearInterval(timerInterval);
  // port.postMessage({ action: "timerStarted" }); // Inform popup

  chrome.runtime.sendMessage({ action: "updateTimer", time: 1500 });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    startTimer(message.time);
  } else if (message.action === "reset") {
    reset();
  }
});
