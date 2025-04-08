chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && (tab.url.includes("linkedin.com/jobs") || tab.url.includes("indeed.com"))) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW_JOB_PAGE",
      url: tab.url
    });
  }
});