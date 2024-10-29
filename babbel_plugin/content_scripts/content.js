// Debug flag - set to false in production
const DEBUG = true;

// Debug logging function
function debugLog(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

document.addEventListener('mousedown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        debugLog('Ctrl or command key pressed and mouse button down');
        document.addEventListener('mouseup', function mouseUpHandler() {
            var selectedText = window.getSelection().toString();
            if (selectedText !== '' && selectedText.length <= 35){
                debugLog('Text selected');
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    debugLog('Range count is not zero. Calling Translation API.');
                    var range = sel.getRangeAt(0);

                    const url = 'https://translate281.p.rapidapi.com/';
                    const options = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'X-RapidAPI-Key': '',
                            'X-RapidAPI-Host': 'translate281.p.rapidapi.com'
                        },
                        body: new URLSearchParams({
                            text: selectedText,
                            from: 'auto',
                            to: 'en'
                        })
                    };

                    fetch(url, options)
                    .then(response => {
                        if (!response.ok) {
                            debugLog('Translation API response not ok, status:', response.status);
                            debugLog('Selected text was:', selectedText);
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        debugLog('Translation received: ', data.response);
                        var translatedText = data.response;
                        var newTextNode = document.createTextNode('[' + translatedText + ']');
                        
                        // Store the translation with timestamp
                        chrome.storage.local.get({translations: []}, function(result) {
                            debugLog('Current translations:', result.translations);
                            
                            const translations = result.translations;
                            translations.push({
                                original: selectedText,
                                translated: translatedText,
                                timestamp: new Date().toISOString()
                            });
                            
                            chrome.storage.local.set({translations: translations}, function() {
                                debugLog('Translation stored successfully');
                                debugLog('Updated translations:', translations);
                                
                                // Verify the storage
                                chrome.storage.local.get('translations', function(data) {
                                    debugLog('Current stored translations:', data.translations);
                                });
                            });
                        });
                        
                        range.deleteContents();
                        range.insertNode(newTextNode);
                        range.insertNode(document.createTextNode(selectedText));
                        
                        // Move the cursor after the inserted node
                        range.setStartAfter(newTextNode);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        var errorTextNode = document.createTextNode('[Translation error]');
                        
                        range.deleteContents();
                        range.insertNode(errorTextNode);
                        range.insertNode(document.createTextNode(selectedText));
                        
                        // Move the cursor after the inserted node
                        range.setStartAfter(errorTextNode);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    });
                }
            } else {
                debugLog('Text not selected or too long');
            }
            // Remove the mouseup event listener after handling it once
            document.removeEventListener('mouseup', mouseUpHandler);
        });
    }
});
