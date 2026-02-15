import React, { useEffect } from 'react';
import './App.css';
import { initAndCacheData } from './db/dataCache';
import { Routes, Route, HashRouter } from 'react-router-dom';

function App() {

  useEffect(() => {
    initAndCacheData();
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={ <p>Aloitus</p> }/>
          <Route path="/InfoPageGameOne" element={ <p>Info</p> }/>
          <Route path="/GamePageGameOne" element={ <p>Peli</p> }/>
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
