import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getFromStore } from "../db/dataCache";
import { GameOnePhaseOne } from "../components/GameOnePhaseOne.js";
import { GameOnePhaseTwo } from "../components/GameOnePhaseTwo.js";
import { GameOnePhaseThree } from "../components/GameOnePhaseThree.js";
import "./GamePageGameOne.css";

export function GamePageGameOne() {
  const location = useLocation();
  const difficulty = String(location.state?.state || "0");

  const [game, setGame] = useState(null);
  const [isPhaseOne, setIsPhaseOne] = useState(true);
  const [isPhaseTwoComplete, setIsPhaseTwoComplete] = useState(false);
  const [isPhaseThreeComplete, setIsPhaseThreeComplete] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchNewTask = useCallback(async () => {
    try {
      const task = await getFromStore(difficulty);

      if (task) {
        setGame(task);
        setLoadError(false);
      } else {
        setGame(null);
        setLoadError(true);
      }
    } catch {
      setGame(null);
      setLoadError(true);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchNewTask();
  }, [difficulty, fetchNewTask]);

  const handleRestart = () => {
    setIsPhaseOne(true);
    setIsPhaseTwoComplete(false);
    setIsPhaseThreeComplete(false);
    fetchNewTask();
  };

  const handlePhaseOneComplete = () => {
    setIsPhaseOne(false);
  };

  const handlePhaseTwoComplete = () => {
    setIsPhaseTwoComplete(true);
  };

  return (
    <div className="game-page">
      {loadError ? <p>Tehtavaa ei voitu ladata.</p> : null}

      {isPhaseOne ? (
        <>
          <GameOnePhaseOne data={game} allFound={handlePhaseOneComplete} />
          <button
            className="RestartButton"
            onClick={() => {
              handleRestart();
            }}
          >
            Vaihda tekstiä
          </button>
        </>
      ) : !isPhaseTwoComplete ? (
        <>
          <GameOnePhaseTwo
            data={game}
            onPhaseComplete={handlePhaseTwoComplete}
            onChangeText={handleRestart}
          />
        </>
      ) : !isPhaseThreeComplete ? (
        <>
          <GameOnePhaseThree data={game} />
        </>
      ) : (
        <button onClick={handleRestart}>Uusi</button>
      )}
    </div>
  );
}
