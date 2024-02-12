const blockerSec = document.getElementById("blockerSec");
const blockButton = document.getElementById("block");
const urlList = document.getElementById("urlList");
let blockUrl = "";

let blockedUrls = new Map();

chrome.storage.sync.get(["blockedUrls"], (items) => {
  if (chrome.runtime.lastError) {
    console.error("Error retrieving data:", chrome.runtime.error);
  } else {
    if (items.blockedUrls) {
      blockedUrls = new Map(Object.entries(items.blockedUrls));
      renderblockedUrls(blockedUrls);
    } else {
      console.log("No saved todo Map found.");
    }
  }
});

blockerSec.addEventListener("input", (e) => {
  blockUrl = e.target.value;
  console.log(blockUrl);
});

blockButton.addEventListener("click", () => {
  if (blockUrl.trim() !== "") {
    blockedUrls.set(
      `url_${Math.floor(Math.random() * 10000)}`,
      blockUrl.trim()
    );
    chrome.runtime.sendMessage({
      action: "addBlockUrl",
      urlList: Object.fromEntries(blockedUrls),
    });
    renderblockedUrls();
  }
});

const renderblockedUrls = () => {
  urlList.innerHTML = "";
  blockedUrls.forEach((value, key) => {
    const urlItem = document.createElement("div");

    urlItem.innerHTML = `<li class="flex w-full items-center justify-start p-4 md:p-6 todo-item">
    <p
      id="${key}"
      class="mr-3 truncate text-left text-sm font-semibold text-white md:text-base todo-item">
      ${value}
    </p>
    <button class="ml-2 flex flex-shrink-0 border-[1px] border-red-500 bg-red-500 p-1 remove-button" data-url-id="${key}">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
        class="h-5 w-5 text-white remove-button" data-todo-id = "${key}">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
      </svg>
    </button>
    </li>`;

    urlList.appendChild(urlItem);
  });
};
