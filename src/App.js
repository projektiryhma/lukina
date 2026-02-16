import React from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { InfoPageGameOne } from './pages/InfoPageGameOne';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <header className='App-header'>
          <span className='header-text'>LUKINA</span>
        </header>
        <Routes>

          <Route path="/" element={ <p>Aloitus</p> }/>
          <Route path="/InfoPageGameOne" element={ <InfoPageGameOne/> }/>
          <Route path="/GamePageGameOne" element={ <p>Peli</p> }/>
           
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;







