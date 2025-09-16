import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { AnonymizeOptions } from './types';

const CURRENCY_OPTIONS = [
  { value: '€', label: '€ - Euro' },
  { value: '$', label: '$ - Dollar' },
  { value: '£', label: '£ - Pound' },
  { value: '¥', label: '¥ - Yen' },
  { value: '₽', label: '₽ - Ruble' },
  { value: '₴', label: '₴ - Hryvnia' },
  { value: '₦', label: '₦ - Naira' },
  { value: '₨', label: '₨ - Rupee' },
  { value: '₩', label: '₩ - Won' },
  { value: '₫', label: '₫ - Dong' },
  { value: '₭', label: '₭ - Kip' },
  { value: '₮', label: '₮ - Tugrik' },
  { value: '₯', label: '₯ - Drachma' },
  { value: '₱', label: '₱ - Peso' },
  { value: '₳', label: '₳ - Austral' },
];

export default function App() {
  const [options, setOptions] = useState<AnonymizeOptions>({
    products: true,
    prices: true,
    images: false,
    useCurrencySelection: false,
    useCurrencyInput: false,
  });
  const [currencySymbol, setCurrencySymbol] = useState(CURRENCY_OPTIONS[0].value);
  const [customCurrency, setCustomCurrency] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSelection, setHasSelection] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (!msg || msg.type !== 'updateState') return;

      // Always update selection state if provided
      if ('hasSelection' in msg) {
        setHasSelection(msg.hasSelection);
      }

      // Handle state changes
      switch (msg.state) {
        case 'init':
        case 'selectionchange':
          // Only update selection state
          break;
        case 'start':
          setIsProcessing(true);
          break;
        case 'stop':
        case 'complete':
        case 'error':
          setIsProcessing(false);
          break;
      }

      // Show notification if provided
      if (msg.message) {
        parent.postMessage({
          pluginMessage: { type: 'notify', message: msg.message }
        }, '*');
      }
    };

    // Add message listener
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOptionChange = (option: keyof AnonymizeOptions) => {
    // For mutually exclusive currency options
    if (option === 'useCurrencySelection') {
      setOptions(prev => ({
        ...prev,
        useCurrencySelection: !prev.useCurrencySelection,
        useCurrencyInput: false
      }));
    } else if (option === 'useCurrencyInput') {
      setOptions(prev => ({
        ...prev,
        useCurrencyInput: !prev.useCurrencyInput,
        useCurrencySelection: false
      }));
    } else {
      setOptions(prev => ({
        ...prev,
        [option]: !prev[option]
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setOptions(prev => ({ ...prev, customPlaceholderImage: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnonymize = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'anonymize',
        options: {
          ...options,
          currencySymbol: options.useCurrencySelection ? currencySymbol : undefined,
          customCurrency: options.useCurrencyInput ? customCurrency : undefined,
        }
      }
    }, '*');
  };

  const handleStop = () => {
    if (!isProcessing) return;
    parent.postMessage({
      pluginMessage: { type: 'stop' }
    }, '*');
  };

  const handleCancel = () => {
    parent.postMessage({
      pluginMessage: { type: 'cancel' }
    }, '*');
  };

  return (
    <>
      <div className="p-4 bg-[var(--figma-color-bg)] text-[var(--figma-color-text)]">
        <h2 className="text-xl font-semibold mb-4">Content Anonymizer</h2>

        <div className="space-y-3 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.products}
              onChange={() => handleOptionChange('products')}
              className="form-checkbox"
              disabled={isProcessing}
            />
            <span>Anonymize Product Names</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.prices}
              onChange={() => handleOptionChange('prices')}
              className="form-checkbox"
              disabled={isProcessing}
            />
            <span>Anonymize Prices</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.images}
              onChange={() => handleOptionChange('images')}
              className="form-checkbox"
              disabled={isProcessing}
            />
            <span>Replace images with placeholder</span>
          </label>

          {options.images && (
            <div className="pl-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="text-sm text-[var(--figma-color-text-brand)] hover:underline"
                >
                  Upload custom placeholder
                </button>
              </label>
            </div>
          )}

          {/* Currency symbol/acronym replacement controls */}
          <div className="flex flex-col space-y-2 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!options.useCurrencySelection}
                onChange={() => handleOptionChange('useCurrencySelection')}
                className="form-checkbox"
                disabled={isProcessing || !options.prices}
              />
              <span>Change current currency symbol with selection</span>
              <select
                className="ml-2 px-2 py-1 border rounded"
                value={currencySymbol}
                onChange={e => setCurrencySymbol(e.target.value)}
                disabled={!options.useCurrencySelection || isProcessing || !options.prices}
                style={{ minWidth: 130 }}
              >
                {CURRENCY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!options.useCurrencyInput}
                onChange={() => handleOptionChange('useCurrencyInput')}
                className="form-checkbox"
                disabled={isProcessing || !options.prices}
              />
              <span>Change current currency symbol with your input</span>
              <input
                className="ml-2 px-2 py-1 border rounded w-24"
                type="text"
                value={customCurrency}
                onChange={e => setCustomCurrency(e.target.value)}
                placeholder="USD"
                maxLength={6}
                disabled={!options.useCurrencyInput || isProcessing || !options.prices}
              />
            </label>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAnonymize}
            disabled={isProcessing || !hasSelection}
            className="btn btn-primary"
          >
            {isProcessing ? 'Processing...' : hasSelection ? 'Anonymize' : 'Select something'}
          </button>

          <button
            onClick={handleStop}
            disabled={!isProcessing}
            className="btn btn-danger"
          >
            Stop
          </button>

          <button
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            Close Plugin
          </button>
        </div>

        <div className="absolute bottom-2 right-2">
          <button onClick={() => setShowHelp(true)} className="text-xs text-[var(--figma-color-text-tertiary)] hover:underline">
            How to use
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[var(--figma-color-bg)] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">How to use Content Anonymizer</h3>
            <p className="mb-2">1. Select the frames or elements you want to anonymize. If you select nothing, the entire page will be processed.</p>
            <p className="mb-2">2. Choose the content types to anonymize: product names, prices, or images.</p>
            <p className="mb-2">3. For images, you can upload a custom placeholder.</p>
            <p className="mb-4">4. For prices, you can optionally change the currency symbol.</p>
            <button onClick={() => setShowHelp(false)} className="w-full bg-[var(--figma-color-bg-brand)] text-[var(--figma-color-text-onbrand)] py-2 rounded">
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
  { value: '£', label: '£ - Pound' },
  { value: '€', label: '€ - Euro' },
  { value: '¥', label: '¥ - Yen' },
  { value: '₹', label: '₹ - Rupee' },
  { value: '₩', label: '₩ - Won' },
  { value: '₽', label: '₽ - Ruble' },
  { value: '₺', label: '₺ - Lira' },
  { value: '₫', label: '₫ - Dong' },
  { value: '₦', label: '₦ - Naira' },
  { value: '₴', label: '₴ - Hryvnia' },
  { value: '₱', label: '₱ - Peso' },
  { value: '₲', label: '₲ - Guarani' },
  { value: '₵', label: '₵ - Cedi' },
  { value: '₡', label: '₡ - Colon' },
  { value: '₸', label: '₸ - Tenge' },
  { value: '₮', label: '₮ - Tugrik' },
  { value: '₺', label: '₺ - Turkish Lira' },
  { value: '₼', label: '₼ - Azerbaijani Manat' },
  { value: '₾', label: '₾ - Lari' },
  { value: '₿', label: '₿ - Bitcoin' },
  { value: '¤', label: '¤ - Generic Currency' },
];

export default function App() {
  const [options, setOptions] = useState<AnonymizeOptions>({
    products: true,
    prices: true,
    images: false,
    useCurrencySelection: false,
    useCurrencyInput: false,
  });
  const [currencySymbol, setCurrencySymbol] = useState(CURRENCY_OPTIONS[0].value);
  const [customCurrency, setCustomCurrency] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (!msg || msg.type !== 'updateState') return;

      // Always update selection state if provided
      if ('hasSelection' in msg) {
        setHasSelection(msg.hasSelection);
      }

      // Handle state changes
      switch (msg.state) {
        case 'init':
        case 'selectionchange':
          // Only update selection state
          break;
        case 'start':
          setIsProcessing(true);
          break;
        case 'stop':
        case 'complete':
        case 'error':
          setIsProcessing(false);
          break;
      }

      // Show notification if provided
      if (msg.message) {
        parent.postMessage({ 
          pluginMessage: { type: 'notify', message: msg.message }
        }, '*');
      }
    };

    // Add message listener
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOptionChange = (option: keyof AnonymizeOptions) => {
    // For mutually exclusive currency options
    if (option === 'useCurrencySelection') {
      setOptions(prev => ({
        ...prev,
        useCurrencySelection: !prev.useCurrencySelection,
        useCurrencyInput: false
      }));
    } else if (option === 'useCurrencyInput') {
      setOptions(prev => ({
        ...prev,
        useCurrencyInput: !prev.useCurrencyInput,
        useCurrencySelection: false
      }));
    } else {
      setOptions(prev => ({
        ...prev,
        [option]: !prev[option]
      }));
    }
  };

  const handleAnonymize = () => {
    if (!hasSelection || isProcessing) return;
    parent.postMessage({ 
      pluginMessage: { 
        type: 'anonymize',
        options: {
          ...options,
          currencySymbol: options.useCurrencySelection ? currencySymbol : undefined,
          customCurrency: options.useCurrencyInput ? customCurrency : undefined,
        }
      }
    }, '*');
  };

  const handleStop = () => {
    if (!isProcessing) return;
    parent.postMessage({ 
      pluginMessage: { type: 'stop' }
    }, '*');
  };

  const handleCancel = () => {
    parent.postMessage({ 
      pluginMessage: { type: 'cancel' }
    }, '*');
  };

  return (
    <div className="p-4 bg-[var(--figma-color-bg)] text-[var(--figma-color-text)]">
      <h2 className="text-xl font-semibold mb-4">Content Anonymizer</h2>
      
      <div className="space-y-3 mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.products}
            onChange={() => handleOptionChange('products')}
            className="form-checkbox"
            disabled={isProcessing}
          />
          <span>Anonymize Product Names</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.prices}
            onChange={() => handleOptionChange('prices')}
            className="form-checkbox"
            disabled={isProcessing}
          />
          <span>Anonymize Prices</span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.images}
            onChange={() => handleOptionChange('images')}
            className="form-checkbox"
            disabled={isProcessing}
          />
          <span>Anonymize Images</span>
        </label>

        {/* Currency symbol/acronym replacement controls */}
        <div className="flex flex-col space-y-2 pt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!options.useCurrencySelection}
              onChange={() => handleOptionChange('useCurrencySelection')}
              className="form-checkbox"
              disabled={isProcessing || !options.prices}
            />
            <span>Change current currency symbol with selection</span>
            <select
              className="ml-2 px-2 py-1 border rounded"
              value={currencySymbol}
              onChange={e => setCurrencySymbol(e.target.value)}
              disabled={!options.useCurrencySelection || isProcessing || !options.prices}
              style={{ minWidth: 130 }}
            >
              {CURRENCY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!options.useCurrencyInput}
              onChange={() => handleOptionChange('useCurrencyInput')}
              className="form-checkbox"
              disabled={isProcessing || !options.prices}
            />
            <span>Change current currency symbol with your input</span>
            <input
              className="ml-2 px-2 py-1 border rounded w-24"
              type="text"
              value={customCurrency}
              onChange={e => setCustomCurrency(e.target.value)}
              placeholder="USD"
              maxLength={6}
              disabled={!options.useCurrencyInput || isProcessing || !options.prices}
            />
          </label>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleAnonymize}
          disabled={isProcessing || !hasSelection}
          style={{
            backgroundColor: isProcessing || !hasSelection ? 'var(--figma-color-bg-disabled)' : 'var(--figma-color-bg-brand)',
            color: isProcessing || !hasSelection ? 'var(--figma-color-text-disabled)' : 'var(--figma-color-text-onbrand)',
            opacity: isProcessing || !hasSelection ? 0.5 : 1,
            cursor: isProcessing || !hasSelection ? 'not-allowed' : 'pointer',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {isProcessing ? 'Processing...' : hasSelection ? 'Anonymize' : 'Select frames to anonymize'}
        </button>

        <button
          onClick={handleStop}
          disabled={!isProcessing}
          style={{
            backgroundColor: 'var(--figma-color-bg-danger)',
            color: 'var(--figma-color-text-onbrand)',
            opacity: !isProcessing ? 0.5 : 1,
            cursor: !isProcessing ? 'not-allowed' : 'pointer',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none'
          }}
        >
          Stop
        </button>

        <button
          onClick={handleCancel}
          style={{
            backgroundColor: 'var(--figma-color-bg-secondary)',
            color: 'var(--figma-color-text)',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Close Plugin
        </button>
      </div>
    </div>
  );
}
