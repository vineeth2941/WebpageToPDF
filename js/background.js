// Background code goes here
// chrome.browserAction.onLaunched.addListener(() => {
//   chrome.tabs.executeScript(null, {file: "js/content-script.js"});
// });

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log('Execute');
  chrome.tabs.sendMessage(tab.id, 'capture');
});