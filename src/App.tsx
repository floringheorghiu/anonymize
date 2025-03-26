import React, { useState, useEffect } from 'react';
import './index.css';

interface AnonymizeOptions {
  products: boolean;
  prices: boolean;
  images: boolean;
}

export default function App() {
  const [options, setOptions] = useState<AnonymizeOptions>({
    products: true,
    prices: true,
    images: false,
  });
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
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleAnonymize = () => {
    if (!hasSelection || isProcessing) return;
    parent.postMessage({ 
      pluginMessage: { 
        type: 'anonymize',
        options 
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
