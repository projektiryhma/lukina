import "./App.css";

import { initAndCacheData } from "./db/dataCache";
import { Routes, Route, HashRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";
import { InfoPageGameOne } from "./pages/InfoPageGameOne";
import { StartPage } from "./pages/StartPage";
import { GamePageGameOne } from "./pages/GamePageGameOne";

initAndCacheData();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <div className="App">
          <header className="App-header">
            <span className="header-text">LUKINA</span>
          </header>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/InfoPageGameOne" element={<InfoPageGameOne />} />
            <Route path="/GamePageGameOne" element={<GamePageGameOne />} />
          </Routes>
        </div>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
