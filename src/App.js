import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { InfoPageGameOne } from './pages/InfoPageGameOne';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className='App-header'>
          <span className='header-text'>Lukina</span>
        </header>
        <Routes>

          <Route path="/" element={ <p>Aloitus</p> }/>
          <Route path="/InfoPageGameOne" element={ <InfoPageGameOne/> }/>
          <Route path="/GamePageGameOne" element={ <p>Peli</p> }/>
           
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;







