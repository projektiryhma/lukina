import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getFromStore } from "../db/dataCache";

import { GameOnePhaseOne } from "../components/GameOnePhaseOne.js";
import { GameOnePhaseTwo } from "../components/GameOnePhaseTwo.js";

export function GamePageGameOne() {
  const location = useLocation();
  const difficulty = String(location.state?.state || "0");

  const [game, setGame] = useState(null);
  const [isPhaseOne, setIsPhaseOne] = useState(true);

  const fetchNewTask = useCallback(async () => {
    try {
      const task = await getFromStore(difficulty);

      if (task) {
        setGame(task);
      } else {
        console.warn("Empty", difficulty);
      }
    } catch (error) {
      console.error("Error", error);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchNewTask();
  }, [difficulty, fetchNewTask]);

  const handleRestart = () => {
    setIsPhaseOne(true);
    fetchNewTask();
  };

  const handlePhaseOneComplete = () => {
    setIsPhaseOne(false);
  };

  return (
    <div className="game-page">
      {isPhaseOne ? (
        <>
          <GameOnePhaseOne data={game} allFound={handlePhaseOneComplete} />
          <button
            onClick={() => {
              handleRestart();
            }}
          >
            Uusi
          </button>
        </>
      ) : (
        <>
          <GameOnePhaseTwo data={game} onPhaseComplete={handlePhaseComplete} />
          <button onClick={handleRestart}>Uusi</button>
        </>
      )}
    </div>
  );
}
