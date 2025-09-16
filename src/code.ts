import { AnonymizeOptions } from "./types";

// @ts-ignore
var ui = __html__;
// @ts-ignore
var placeholderImageBytes = base64ToUint8Array(__placeholderImage__);


// Initialize plugin UI with fixed dimensions
figma.showUI(ui, {
  width: 400,
  height: 300,
  themeColors: true
});

// ============================================================================
// STABLE: Anonymization Marker System (DO NOT MODIFY UNLESS ABSOLUTELY NECESSARY)
// This code handles tracking of already anonymized text using invisible markers.
// It has been tested and works correctly. Any changes could break functionality.
// Features:
// - Uses zero-width space as invisible marker
// - Prevents re-processing of already anonymized text
// - Maintains text appearance while adding metadata
// Last verified: 2025-01-11
// ============================================================================

// Invisible marker to identify anonymized text (zero-width space)
var ANONYMIZED_MARKER = '\u200B';

// Helper to check if text is already anonymized
function isTextAnonymized(text: string): boolean {
  return text.endsWith(ANONYMIZED_MARKER);
}

// Helper to mark text as anonymized
function markAsAnonymized(text: string): string {
  return text + ANONYMIZED_MARKER;
}

// ============================================================================
// END STABLE: Anonymization Marker System
// ============================================================================

// Currency symbols to detect
var currencySymbols = ['€', '$', '£', '¥', '₽', '₴', '₦', '₨', '₩', '₫', '₭', '₮', '₯', '₱', '₳'];
var currencySymbolsPattern = currencySymbols.map(function(s) { return '\\' + s; }).join('|');

// Regular expressions for different number patterns
var pricePattern = new RegExp('(' + currencySymbolsPattern + ')\\s*(\\d+([.,]\\d{2})?)|(\\d+([.,]\\d{2})?)\\s*(' + currencySymbolsPattern + ')', 'g');
var percentagePattern = /\(?(\d+\.?\d*)%\)?/g;
var numberWithSeparatorPattern = /\d+([.,]\d{2})?/g;

// Function to anonymize prices in a given text
function anonymizePrice(text: string, options: AnonymizeOptions): string {
  try {
    // Don't process if no currency or percentage patterns found
    if (!pricePattern.test(text) && !percentagePattern.test(text)) {
      return text;
    }
    // Reset regex lastIndex
    pricePattern.lastIndex = 0;
    percentagePattern.lastIndex = 0;

    // Determine replacement symbol/acronym
    let replaceSymbol: string | null = null;
    if (options && options.prices) {
      if (options.useCurrencySelection && options.currencySymbol) {
        replaceSymbol = options.currencySymbol;
      } else if (options.useCurrencyInput && options.customCurrency) {
        replaceSymbol = options.customCurrency;
      }
    }

    // First, handle currency amounts
    var result = text.replace(pricePattern, function(match: string): string {
      var currencySymbol = currencySymbols.find(function(symbol) { return match.includes(symbol); });
      if (!currencySymbol) return match;
      var isPrefix = match.startsWith(currencySymbol);
      var numberPart = match.replace(currencySymbol, '').trim();
      var anonymizedNumber = numberPart.replace(numberWithSeparatorPattern, function(num: string): string {
        var whole = num.split(/[.,]/)[0];
        var decimal = num.split(/[.,]/)[1];
        return '0'.repeat(whole.length) + (decimal ? '.' + '0'.repeat(decimal.length) : '');
      });
      // Replace symbol if requested
      if (replaceSymbol !== null && replaceSymbol !== undefined && replaceSymbol !== '') {
        return isPrefix ? replaceSymbol + anonymizedNumber : anonymizedNumber + replaceSymbol;
      } else {
        return isPrefix ? currencySymbol + anonymizedNumber : anonymizedNumber + currencySymbol;
      }
    });

    // Then, handle percentages
    result = result.replace(percentagePattern, function(match: string): string {
      var hasParens = match.startsWith('(') && match.endsWith(')');
      var number = match.replace(/[()%]/g, '');
      var zeros = '0'.repeat(number.replace('.', '').length);
      return hasParens ? '(' + zeros + '%)' : zeros + '%';
    });
    return result;
  } catch (e) {
    console.log('anonymizePrice error:', e);
    return text;
  }
}

// Full Lorem ipsum text for more natural-looking replacements
var loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

function generateLoremText(length: number): string {
  // Simply take a substring of the full Lorem ipsum text
  // If we need more text than we have, repeat the text
  var result = '';
  while (result.length < length) {
    result += loremIpsumText + ' ';
  }
  return result.substring(0, length);
}

function anonymizeText(node: TextNode, options: AnonymizeOptions): void {
  try {
    // Defensive: Only load font if node.fontName is a FontName (not figma.mixed)
    if (typeof node.fontName === 'object' && 'family' in node.fontName && 'style' in node.fontName) {
      figma.loadFontAsync(node.fontName as FontName).then(function() {
      var text = node.characters;
      const wasAnonymized = isTextAnonymized(text);
      // Only skip if already anonymized and NOT changing currency
      if (text.length === 1 || (wasAnonymized && !(options.prices && options.useCurrencySelection))) return;
      let textForProcessing = text;
      // If re-processing for currency change, strip the marker first
      if (wasAnonymized && options.prices && options.useCurrencySelection) {
        textForProcessing = text.slice(0, -ANONYMIZED_MARKER.length);
      }
      if (options.prices && (pricePattern.test(textForProcessing) || percentagePattern.test(textForProcessing))) {
        // Reset regex lastIndex
        pricePattern.lastIndex = 0;
        percentagePattern.lastIndex = 0;
        // Handle price anonymization with currency replacement if requested
        node.characters = markAsAnonymized(anonymizePrice(textForProcessing, options));
      } else if (options.products && !pricePattern.test(text)) {
        // Handle product name anonymization only if no prices present
        var targetLength = Math.max(2, text.length - 2);
        node.characters = markAsAnonymized(generateLoremText(targetLength));
      }
    });
    } // End if fontName is FontName
  } catch (e) {
    console.log('anonymizeText error:', e);
  }
}

// Utility: decode base64 to Uint8Array
// Pure JS base64 decoder for Figma plugin backend
function base64ToUint8Array(base64: string): Uint8Array {
  // Remove data URL prefix if present
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = base64Data.replace(/=+$/, '');
  let output = [];

  for (let bc = 0, bs = 0, buffer, i = 0; (buffer = str.charAt(i++)); ~buffer &&
    (bs = bc % 4 ? bs * 64 + buffer : buffer,
      bc++ % 4) ? output.push(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return new Uint8Array(output);
}

function anonymizeImage(node: SceneNode, options: AnonymizeOptions): Promise<void> {
  if (!options.images) return Promise.resolve();

  if ("fills" in node) {
    // Create a new array to modify since Figma's fills array is read-only
    var fills = (node.fills as Paint[]).slice();
    var hasImageFill = false;

    for (var i = 0; i < fills.length; i++) {
      var fill = fills[i];
      if (fill.type === "IMAGE") {
        hasImageFill = true;
        // Debug: log options and customPlaceholderImage
        try {
          // eslint-disable-next-line no-console
          console.log('[anonymizeImage] options.customPlaceholderImage:', options.customPlaceholderImage ? (typeof options.customPlaceholderImage + ' len=' + options.customPlaceholderImage.length) : 'none');
        } catch (e) {}
        let imageBytes: Uint8Array = placeholderImageBytes;
        if (options.customPlaceholderImage && typeof options.customPlaceholderImage === 'string') {
          try {
            // eslint-disable-next-line no-console
            console.log('[anonymizeImage] Attempting to decode custom image...');
            imageBytes = base64ToUint8Array(options.customPlaceholderImage);
            // eslint-disable-next-line no-console
            console.log('[anonymizeImage] Decoded custom image bytes length:', imageBytes.length);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('[anonymizeImage] Failed to decode custom image, using default.', e);
            imageBytes = placeholderImageBytes;
          }
        } else {
          // eslint-disable-next-line no-console
          console.log('[anonymizeImage] No custom image, using default.');
        }
        var placeholderImageHash = figma.createImage(imageBytes);
        // Replace the original image fill with the placeholder
        fills[i] = {
          type: "IMAGE",
          imageHash: placeholderImageHash.hash,
          scaleMode: (fill as ImagePaint).scaleMode // Preserve original scaling mode
        };
      }
    }
    // Only update fills if we actually found and replaced an image
    if (hasImageFill) {
      node.fills = fills;
    }
  }
  return Promise.resolve();
}

// State flags for processing control
var isProcessing = false;  // Tracks if anonymization is running
var shouldStop = false;    // Flag to stop processing when requested

// Send initial state
figma.ui.postMessage({ 
  type: 'updateState',
  hasSelection: figma.currentPage.selection.length > 0
});

// Listen for selection changes
figma.on("selectionchange", function() {
  figma.ui.postMessage({ 
    type: 'updateState',
    state: 'selectionchange',
    hasSelection: figma.currentPage.selection.length > 0
  });
});

// Handle messages from the UI
// Defensive: log all incoming messages for debugging
figma.ui.onmessage = function(msg) {
  try {
    console.log('Received message from UI:', msg);
  } catch (e) {}

  switch (msg.type) {
    case 'stop':
      if (isProcessing) {
        shouldStop = true;
        isProcessing = false;
        figma.ui.postMessage({ 
          type: 'updateState',
          state: 'stop',
          message: 'Processing stopped',
          hasSelection: figma.currentPage.selection.length > 0
        });
      }
      break;

    case 'cancel':
      figma.closePlugin();
      break;

    case 'anonymize':
      if (!msg.options || isProcessing) return;
      
      let nodesToProcess: readonly SceneNode[] = figma.currentPage.selection;

      // If nothing is selected, process the entire page
      if (nodesToProcess.length === 0) {
        nodesToProcess = figma.currentPage.children;
      }

      isProcessing = true;
      shouldStop = false;
      figma.ui.postMessage({ 
        type: 'updateState',
        state: 'start',
        hasSelection: true
      });

      try {
        // Process each selected node
        var promises: Promise<void>[] = [];
        for (var i = 0; i < nodesToProcess.length; i++) {
          if (shouldStop) break;
          promises.push(processNode(nodesToProcess[i], msg.options));
        }

        // Notify completion and reset state
        Promise.all(promises).then(() => {
          isProcessing = false;
          shouldStop = false;
          figma.ui.postMessage({ 
            type: 'updateState',
            state: shouldStop ? 'stop' : 'complete',
            message: shouldStop ? 'Processing stopped' : 'Anonymization complete!',
            hasSelection: figma.currentPage.selection.length > 0
          });
        });
      } catch (e) {
        isProcessing = false;
        shouldStop = false;
        figma.ui.postMessage({ 
          type: 'updateState',
          state: 'error',
          message: 'An error occurred during processing',
          hasSelection: figma.currentPage.selection.length > 0
        });
      }
      break;
  }
};

// Process a single node and its children recursively
function processNode(node: SceneNode, options: AnonymizeOptions): Promise<void> {
  if (shouldStop) return Promise.resolve();  // Exit if stop was requested

  var promises: Promise<void>[] = [];

  // Process text nodes and image fills
  if (node.type === "TEXT") {
    anonymizeText(node, options);
  } else if (options.images && ("fills" in node)) {
    promises.push(anonymizeImage(node, options));
  }

  // Process children if they exist
  if ('children' in node) {
    for (var i = 0; i < node.children.length; i++) {
      if (shouldStop) break;
      promises.push(processNode(node.children[i], options));
    }
  }

  return Promise.all(promises).then(() => {});
}
