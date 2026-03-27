import { useEffect } from "react";
import "./App.css";

import { initAndCacheData } from "./db/dataCache";
import { Routes, Route, HashRouter } from "react-router-dom";
import { InfoPageGameOne } from "./pages/InfoPageGameOne";
import { StartPage } from "./pages/StartPage";
import { GamePageGameOne } from "./pages/GamePageGameOne";

function App() {
  useEffect(() => {
    initAndCacheData();
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <header className="App-header">
          <p className="header-text">LUKINA</p>
        </header>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/InfoPageGameOne" element={<InfoPageGameOne />} />
          <Route path="/GamePageGameOne" element={<GamePageGameOne />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
