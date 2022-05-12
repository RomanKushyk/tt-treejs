import React, {useState} from 'react';
import './App.css';
import ScanModule from './ScanModule';
import ThreexComp from './ThreexComp';

function App() {
  const [showScanModule, setShowScanModule] = useState(false);

  return (
    <ScanModule/>
  );
}

export default App;
