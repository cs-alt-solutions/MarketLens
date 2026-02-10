import React, { useState, useEffect } from 'react';
import { ConsoleLayout } from './features/workbench/ConsoleLayout';
import { WorkbenchProvider } from './context/WorkbenchContext';
import './styles/global.css';

// --- BOOT SCREEN COMPONENT ---
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
    // FIXED: Removed unused 'index' parameter
    bootText.forEach((text) => {
      delay += Math.random() * 400 + 200; // Random typing jitter
      setTimeout(() => {
        setLines(prev => [...prev, text]);
      }, delay);
    });

    // Finish boot
    setTimeout(onComplete, 2500);
  }, [onComplete]);

  return (
    <div style={{
      height: '100vh', width: '100vw', background: '#09090b', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'monospace', color: '#22d3ee', flexDirection: 'column'
    }}>
      <div style={{ width: '300px', textAlign: 'left' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ marginBottom: '5px', textShadow: '0 0 5px #22d3ee' }}>
            {`> ${line}`}
          </div>
        ))}
        <div className="cursor-blink" style={{ display: 'inline-block', width: '10px', height: '15px', background: '#22d3ee' }}></div>
      </div>
    </div>
  );
};

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <WorkbenchProvider>
      {!booted ? (
        <BootScreen onComplete={() => setBooted(true)} />
      ) : (
        <ConsoleLayout />
      )}
    </WorkbenchProvider>
  );
}

export default App;