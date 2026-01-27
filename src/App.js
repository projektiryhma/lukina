import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <header className="App-header">
              <h1>Hello World</h1>
            </header>
          }/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
