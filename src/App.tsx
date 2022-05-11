import React, {useState} from 'react';
import './App.css';
import {ScanModule} from './components/ScanModule';

function App() {
  const [showScanModule, setShowScanModule] = useState(false);

  return (
    <div className="App">
      <div className="container">
          <button
              type="button"
              className="button"
              onClick={() => {
                  setShowScanModule(!showScanModule)
              }}
          >
              {
                  !showScanModule
                      ? 'Show'
                      : 'Hide'
              }
          </button>

          {showScanModule && <ScanModule/>}
      </div>
    </div>
  );
}

export default App;
