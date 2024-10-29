chrome.action.onClicked.addListener(() => {
    console.log('Extension icon clicked');
    chrome.tabs.create({ url: chrome.runtime.getURL('translations.html') });
}); 