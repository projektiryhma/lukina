import React from 'react';
import { Link } from 'react-router-dom';
import './StartPage.css';

function StartPage() {
  return (
    <div className="start-page App-header">
      <h1>Tervetuloa</h1>
      <p>Valitse seuraava sivu jatkaaksesi:</p>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '0.5rem 0' }}><Link to="/InfoPageGameOne">Info</Link></li>
          <li style={{ margin: '0.5rem 0' }}><Link to="/GamePageGameOne">Aloita peli</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default StartPage;
