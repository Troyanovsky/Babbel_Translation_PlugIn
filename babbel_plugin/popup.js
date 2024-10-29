const debugDiv = document.getElementById('debug');
const errorDiv = document.getElementById('error');
const tbody = document.getElementById('translation-list');

function log(msg) {
    console.log(msg);
    // debugDiv.innerHTML += `<div>${msg}</div>`;
}

function showError(msg) {
    console.error(msg);
    errorDiv.innerHTML += `<div>${msg}</div>`;
}

function clearTranslations() {
    if (confirm('Are you sure you want to clear all translations?')) {
        chrome.storage.local.set({translations: []}, function() {
            log('All translations cleared');
            loadTranslations(); // Reload the empty list
        });
    }
}

function loadTranslations() {
    log('Starting to load translations...');
    
    chrome.storage.local.get('translations', function(data) {
        if (chrome.runtime.lastError) {
            showError('Error: ' + chrome.runtime.lastError.message);
            return;
        }

        const translations = data.translations || [];
        log(`Loaded ${translations.length} translations`);

        // Clear existing content
        tbody.innerHTML = '';

        if (translations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No translations yet</td></tr>';
            return;
        }

        // Sort translations by timestamp (newest first)
        translations
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach(translation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${translation.original || 'N/A'}</td>
                    <td>${translation.translated || 'N/A'}</td>
                    <td>${new Date(translation.timestamp).toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
    });
}

// Load translations when the popup opens
document.addEventListener('DOMContentLoaded', loadTranslations);

// Create button container for better styling
const buttonContainer = document.createElement('div');
buttonContainer.style.marginBottom = '10px';
buttonContainer.style.display = 'flex';
buttonContainer.style.gap = '10px';

// Add refresh button
const refreshButton = document.createElement('button');
refreshButton.textContent = 'Refresh';
refreshButton.onclick = loadTranslations;

// Add clear button
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear All';
clearButton.onclick = clearTranslations;
clearButton.style.backgroundColor = '#ff4444';
clearButton.style.color = 'white';
clearButton.style.border = 'none';
clearButton.style.padding = '5px 10px';
clearButton.style.cursor = 'pointer';

// Add buttons to container
buttonContainer.appendChild(refreshButton);
buttonContainer.appendChild(clearButton);

// Add button container before table
document.body.insertBefore(buttonContainer, document.querySelector('table')); 