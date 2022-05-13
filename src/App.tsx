import React, {useState} from 'react';
import './App.css';
import {ThreeModule} from './ThreeModule';

function App() {
  const [showScanModule, setShowScanModule] = useState(false);

  return (
    <ThreeModule/>
  );
}

export default App;
