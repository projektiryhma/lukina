import { useEffect } from "react";
import "./App.css";

import { initAndCacheData } from "./db/dataCache";
import { Routes, Route, HashRouter } from "react-router-dom";
import { InfoPageGameOne } from "./pages/InfoPageGameOne";
import { StartPage } from "./pages/StartPage";

function App() {
  useEffect(() => {
    initAndCacheData();
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <header className="App-header">
          <span className="header-text">LUKINA</span>
        </header>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/InfoPageGameOne" element={<InfoPageGameOne />} />
          <Route path="/GamePageGameOne" element={<p>Peli</p>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;