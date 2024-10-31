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

// Add sort state to track current sorting method
let currentSort = 'time'; // 'time' or 'alpha'

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

        // Sort translations based on current sort method
        const sortedTranslations = [...translations].sort((a, b) => {
            if (currentSort === 'time') {
                return new Date(b.timestamp) - new Date(a.timestamp);
            } else {
                return a.original.localeCompare(b.original);
            }
        });

        sortedTranslations.forEach(translation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${translation.original || 'N/A'}</td>
                <td>${translation.translated || 'N/A'}</td>
                <td>${new Date(translation.timestamp).toLocaleString()}</td>
                <td style="text-align: center">
                    <span class="delete-btn" title="Delete">🗑️</span>
                </td>
            `;
            
            // Add click handler for delete button
            row.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this translation?')) {
                    deleteTranslation(translation.timestamp);
                }
            });
            
            tbody.appendChild(row);
        });

        // Update sort button text
        sortButton.textContent = currentSort === 'time' ? 'Sort: Time ⌚' : 'Sort: A-Z 🔤';
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

// Add sort button
const sortButton = document.createElement('button');
sortButton.textContent = 'Sort: Time ⌚';
sortButton.onclick = () => {
    currentSort = currentSort === 'time' ? 'alpha' : 'time';
    loadTranslations();
};

// Add export function
function exportTranslations() {
    chrome.storage.local.get('translations', function(data) {
        const translations = data.translations || [];
        
        // Create a Blob with the JSON data
        const blob = new Blob([JSON.stringify(translations, null, 2)], {
            type: 'application/json'
        });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `translations_${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Add export button
const exportButton = document.createElement('button');
exportButton.textContent = 'Export 📥';
exportButton.onclick = exportTranslations;

// Add buttons to container
buttonContainer.appendChild(refreshButton);
buttonContainer.appendChild(sortButton);
buttonContainer.appendChild(clearButton);
buttonContainer.appendChild(exportButton);

// Add button container before table
document.body.insertBefore(buttonContainer, document.querySelector('table'));

// Add this new function to handle deletion
function deleteTranslation(timestamp) {
    chrome.storage.local.get('translations', function(data) {
        const translations = data.translations || [];
        const updatedTranslations = translations.filter(t => t.timestamp !== timestamp);
        
        chrome.storage.local.set({translations: updatedTranslations}, function() {
            log('Translation deleted');
            loadTranslations(); // Reload the list
        });
    });
}