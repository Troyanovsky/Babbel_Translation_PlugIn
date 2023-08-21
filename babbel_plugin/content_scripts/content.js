document.addEventListener('mousedown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        console.log('Ctrl or command key pressed and mouse button down');
        document.addEventListener('mouseup', function mouseUpHandler() {
            var selectedText = window.getSelection().toString();
            if (selectedText !== '' && selectedText.length <= 35){
                console.log('Text selected');
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    console.log('Range count is not zero. Calling Translation API.');
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
                            console.log('Translation API response not ok, status:', response.status);
                            console.log('Selected text was:', selectedText);
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Translation received: ', data.response);
                        var translatedText = data.response;
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
            } else {
                console.log('Text not selected or too long');
            }
            // Remove the mouseup event listener after handling it once
            document.removeEventListener('mouseup', mouseUpHandler);
        });
    }
});
