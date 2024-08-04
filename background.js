
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-calendar",
    title: "予定をカレンダーに追加",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-to-calendar") {
    chrome.tabs.sendMessage(tab.id, { action: "addToCalendar", text: info.selectionText });
  }
});
