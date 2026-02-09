import React from 'react';
import { WorkbenchBoard } from './features/workbench/WorkbenchBoard';
// import "./App.css";  <-- DELETE THIS LINE
import './styles/global.css'; // Make sure this line is here instead

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <WorkbenchBoard />
    </div>
  );
}

export default App;