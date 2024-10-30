# Babbel Translation Plugin

A browser extension that provides instant translations and maintains a history of your translated text. Perfect for language learners and anyone working with multiple languages.

## Features

- Instant text translation
- Translation history tracking
- Minimal, clean interface
- Supports multiple languages

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Troyanovsky/Babbel_Translation_PlugIn.git
```

2. Configure your API key (see Configuration section below)

3. Load the extension in your browser:
   - Chrome: 
     1. Go to `chrome://extensions/`
     2. Enable "Developer mode"
     3. Click "Load unpacked"
     4. Select the `babbel_plugin` directory

## Configuration

To use this plugin, you'll need to set up your OpenAI API key:

1. Create a file named `config.js` in the content_scripts folder
2. Add your API key using this format:

```javascript
const CONFIG = {
    RAPID_API_KEY: '<your-api-key-here'>'
}; 
```

3. Get your API key from [Rapid API](https://rapidapi.com/mrcodar7/api/Translate)
4. Replace `'your-api-key-here'` with your actual API key

⚠️ **Important**: Never commit your `config.js` file to version control. Make sure it's included in your `.gitignore` file.

## Usage

1. Select any text on a webpage while holding command/ctrl
2. Your translation will be shown after the selected word.
3. You can view your translation history by clicking on the plugin icon in Chrome.

## Security Note

Keep your API key secure and never share it publicly. The `config.js` file is already included in `.gitignore` to prevent accidental exposure.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
