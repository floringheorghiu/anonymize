import React, { useState, useEffect } from 'react';
import './index.css';

interface AnonymizeOptions {
  products: boolean;
  prices: boolean;
  images: boolean;
  useCurrencySelection?: boolean;
  useCurrencyInput?: boolean;
}

const CURRENCY_OPTIONS = [
  { value: '$', label: '$ - Dollar' },
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
