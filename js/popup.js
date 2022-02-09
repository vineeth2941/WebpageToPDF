button = document.getElementById('button');
console.log(button);
button.onclick = chrome.tabs.captureVisibleTab((screenshotUrl) => {
  // console.log(screenshotUrl);
  drawCanvas(screenshotUrl);
});