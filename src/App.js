import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          
          <Route path="/" element={ <p>Aloitus</p> }/>
          <Route path="/InfoPageGameOne" element={ <p>Info</p> }/>
          <Route path="/GamePageGameOne" element={ <p>Peli</p> }/>
           
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
