let blockedUrls = new Map();

function startTimer(timeRemaining) {
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
  clearInterval(timerInterval);
  // port.postMessage({ action: "timerStarted" }); // Inform popup

  chrome.runtime.sendMessage({ action: "updateTimer", time: 1500 });
}

chrome.storage.sync.get(["blockedUrls"], (items) => {
  if (chrome.runtime.lastError) {
    console.error("Error retrieving data:", chrome.runtime.error);
  } else {
    if (items.blockedUrls) {
      blockedUrls = new Map(Object.entries(items.blockedUrls));
    } else {
      console.log("No saved todo Map found.");
    }
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    blockedUrls.forEach((value, key) => {
      if (details.url.includes(value)) {
        return { cancel: true }; // Block the request if URL matches
      } else {
        return { cancel: false }; // Allow the request otherwise
      }
    });
  },
  { urls: ["<all_urls>"], types: ["main_frame"] }
);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addBlockUrl") {
    blockedUrls = new Map(Object.entries(request.urlList));
    chrome.storage.sync.set({ blockedUrls: Object.fromEntries(blockedUrls) });
    sendResponse({ success: true });
  } else if (request.action === "getBlockedUrls") {
    sendResponse({ blockedUrls });
  } else {
    sendResponse({ error: "Invalid action" });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    startTimer(message.time);
  } else if (message.action === "reset") {
    reset();
  }
});
