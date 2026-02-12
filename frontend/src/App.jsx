/* src/App.jsx */
import React, { useState } from 'react';
import { ConsoleLayout } from './features/workbench/ConsoleLayout';
import { InventoryProvider } from './context/InventoryContext';
import { FinancialProvider } from './context/FinancialContext';
import { BootScreen } from './components/BootScreen';
import './styles/global.css';

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