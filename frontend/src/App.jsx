import React, { useState, useEffect } from 'react';
import { ConsoleLayout } from './features/workbench/ConsoleLayout';
import { InventoryProvider } from './context/InventoryContext'; // NEW
import { FinancialProvider } from './context/FinancialContext'; // NEW
import './styles/global.css';

// Boot Screen Component - Logic Only
const BootScreen = ({ onComplete }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const bootText = [
      "INITIALIZING KERNEL...",
      "LOADING MARKET PROTOCOLS...",
      "ESTABLISHING SECURE CONNECTION...",
      "DECRYPTING ASSETS...",
      "ACCESS GRANTED."
    ];

    let delay = 0;
    bootText.forEach((text) => {
      delay += Math.random() * 400 + 200; 
      setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
    });

    setTimeout(onComplete, 2500);
  }, [onComplete]);

  return (
    <div className="boot-container">
      <div className="boot-terminal">
        {lines.map((line, i) => (
          <div key={i} className="boot-line">
            {`> ${line}`}
          </div>
        ))}
        <div className="cursor-blink"></div>
      </div>
    </div>
  );
};

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <InventoryProvider>
      <FinancialProvider>
        {!booted ? (
          <BootScreen onComplete={() => setBooted(true)} />
        ) : (
          <ConsoleLayout />
        )}
      </FinancialProvider>
    </InventoryProvider>
  );
}

export default App;