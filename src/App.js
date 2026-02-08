import React, { useEffect } from 'react';
import './App.css';
import { initAndCacheData } from './db/dataCache';

function App() {

  useEffect(() => {
    initAndCacheData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World</h1>
      </header>
    </div>
  );
}

export default App;
