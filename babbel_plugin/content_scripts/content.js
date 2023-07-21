document.addEventListener('mousedown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        console.log('ctrl or command key pressed and mouse button down');
        document.addEventListener('mouseup', function mouseUpHandler() {
            var selectedText = window.getSelection().toString();
            if (selectedText !== '') {
                console.log('text selected');
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    console.log('range count is not zero');
                    var range = sel.getRangeAt(0);

                    const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
                    const options = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Accept-Encoding': 'application/gzip',
                            'X-RapidAPI-Key': '<replace with your rapid api key, get one here: https://rapidapi.com/hub>',
                            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                        },
                        body: new URLSearchParams({
                            q: selectedText,
                            target: 'en'
                        })
                    };

                    fetch(url, options)
                    .then(response => {
                        if (!response.ok) {
                            console.log('Translation API response not ok, status:', response.status);
                            console.log('Selected text was:', selectedText);
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Translation received: ', data.data.translations[0].translatedText);
                        var translatedText = data.data.translations[0].translatedText;
                        var newTextNode = document.createTextNode('[' + translatedText + ']');
                        
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
            }
            // Remove the mouseup event listener after handling it once
            document.removeEventListener('mouseup', mouseUpHandler);
        });
    }
});
