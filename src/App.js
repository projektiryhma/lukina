import React, { useEffect } from 'react';
import './App.css';
import { initAndCacheData } from './db/dataCache';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';

function App() {

  useEffect(() => {
    initAndCacheData();
  }, []);

  return (
    <BrowserRouter basename="/lukina">
      <div className="App">
        <Routes>
          
          <Route path="/" element={ <StartPage /> }/>
          <Route path="/InfoPageGameOne" element={ <p>Info</p> }/>
          <Route path="/GamePageGameOne" element={ <p>Peli</p> }/>
           
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
