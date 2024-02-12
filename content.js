chrome.runtime.sendMessage({ action: "getBlockedUrls" }, (response) => {
  const blockedUrls = response.blockedUrls;
  // Check if the current URL is blocked

  console.log(blockedUrls);
  blockedUrls.forEach((value, key) => {
    if (window.location.href.includes(value)) {
      document.body.innerHTML = "This website is blocked!";
    }
  });
});
