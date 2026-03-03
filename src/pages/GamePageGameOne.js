import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

export function GamePageGameOne() {
  const location = useLocation();
  const difficulty = location.state?.state || "0";

  const [game, setGame] = useState(null);
  const [isPhaseOne, setIsPhaseOne] = useState(true);

  const fetchNewTask = useCallback(async () => {
    const data = "data";
    setGame(data);
    // data fetch
  }, []);

  useEffect(() => {
    fetchNewTask();
  }, [difficulty]);

  const handleRestart = () => {
    setIsPhaseOne(true);
    fetchNewTask();
  };

  return (
    <div className="game-page">
      {isPhaseOne ? (
        <button onClick={() => setIsPhaseOne(false)}>seuraava</button>
      ) : (
        <div className="phase-two">
          <h2>Vaihe 2 </h2>
          <button
            onClick={() => {
              handleRestart();
            }}
          >
            Seuraava tehtävä
          </button>
        </div>
      )}
    </div>
  );
}
