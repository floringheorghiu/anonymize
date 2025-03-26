# Figma Content Anonymizer Plugin

A Figma plugin that helps anonymize sensitive content in your designs by replacing product names with Lorem ipsum text, prices with generic placeholders, and images with neutral content.

## Version 1.1.0-stable

### Features

- **Smart Text Anonymization**
  - Product names are replaced with length-matching Lorem ipsum text
  - Example: "Adidas" → "Lorem ", "IBM" → "Lor"

- **Advanced Price Handling**
  - Preserves currency symbols and their position (prefix/suffix)
  - Maintains decimal separators and number format
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
  - Replaces image content with neutral gray placeholders
  - Works with various fill types and preserves original scaling modes
  - Handles both background images and image fills

- **Process Control**
  - Stop button to halt processing at any time
  - Works on selected frames or entire document
  - Visual feedback during processing

## Usage

1. Select the frames or elements you want to anonymize
2. Run the plugin from Plugins menu
3. Choose your anonymization options:
   - Anonymize Product Names (length-matching Lorem ipsum)
   - Anonymize Prices (preserves format and currency)
   - Anonymize Images (replaces with neutral placeholders)
4. Click "Anonymize" to process the selection
5. Use the Stop button if you need to halt the process

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
