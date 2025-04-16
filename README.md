# Figma Content Anonymizer Plugin

A Figma plugin that helps anonymize sensitive content in your designs by replacing product names with Lorem ipsum text, prices with generic placeholders, and images with neutral content.

## Version 1.1.0-stable

### What's New (v1.24)
- **Custom Placeholder Image Upload:** Upload your own PNG/JPG as a placeholder for anonymized images. If not set, the built-in placeholder is used.
- **Improved Currency Handling:**
  - Change all prices to a selected currency symbol (dropdown) or your own acronym.
  - You can now change the currency for already-anonymized prices without issues.
- **Microcopy & UI Enhancements:**
  - Shorter, clearer labels for all options.
  - Streamlined and modernized UI.
  - Version display and "How to use" help link added to the bottom right.
- **Help Modal:**
  - Click "How to use" for a concise, user-friendly modal with plugin instructions.

### Features

- **Smart Text Anonymization**
  - Product names are replaced with length-matching Lorem ipsum text
  - Example: "Adidas" → "Lorem ", "IBM" → "Lor"

- **Advanced Price Handling**
  - Preserves currency symbols and their position (prefix/suffix)
  - Maintains decimal separators and number format
  - Change currency symbol or use a custom acronym
  - Re-anonymize prices to update currency symbol even if already anonymized
  - Examples:
    - "€175.00" → "€000.00"
    - "RRP €175.00 Save €115.01 (66%)" → "RRP €000.00 Save €000.00 (00%)"
    - "2 x €49.99" → "2 x €00.00"

- **Multiple Currency Support**
  - Handles various currency symbols: €, $, £, ¥, ₽, ₴, ₦, ₨, ₩, ₫, ₭, ₮, ₯, ₱, ₳
  - Works with both prefix and suffix currency positions

- **Percentage Handling**
  - Anonymizes percentage values while preserving format
  - Handles parentheses: "(66%)" → "(00%)"

- **Image Anonymization**
  - Replaces image content with a neutral placeholder
  - Upload your own PNG/JPG as a custom placeholder, or use the built-in default
  - Works with various fill types and preserves original scaling modes

- **Modern UI & UX**
  - Clear, concise microcopy
  - Version display and help link
  - Minimal, accessible help modal
  - Handles both background images and image fills

- **Process Control**
  - Stop button to halt processing at any time
  - Works on selected frames or entire document
  - Visual feedback during processing

## Usage

1. Select the frames or elements you want to anonymize in Figma.
2. Run the plugin from the Plugins menu.
3. Choose your options:
   - **Anonymize product names**
   - **Anonymize prices** (optionally change currency or use your own acronym)
   - **Replace images with placeholder** (optionally upload your own PNG/JPG)
4. Click **Anonymize Content** to process your selection.
5. Use the **Stop** button to halt processing if needed.
6. Click **How to use** in the UI for a quick help modal at any time.

### Best Practices

- For large documents, process sections gradually to monitor progress
- Use selection to target specific parts of your design
- Check your results after anonymization to ensure all sensitive content is properly replaced

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run watch
```

3. In Figma desktop app:
   - Go to Plugins > Development > New Plugin
   - Choose "Import plugin from manifest..."
   - Select the manifest.json file from this project

## Building for Production

```bash
npm run build
```

## License

MIT License
