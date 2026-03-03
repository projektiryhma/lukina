import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
// import { getFromStore, initAndCacheData } from "../db/dataCache";

import { GameOnePhaseOne } from "../components/GameOnePhaseOne.js";

const TASOT = {
  version: "1.0.0",
  0: [
    {
      "Virheetön teksti": "Easy test item",
      "Virheellinen teksti, virheet punaisella": "Easy test item with error",
      "Virheiden lukumäärä tekstissä": 1,
      "Virheelliset sanat": "test",
      "Oikeat sanat": "test",
    },
  ],
  1: [
    {
      "Virheetön teksti": "Medium test item",
      "Virheellinen teksti, virheet punaisella": "Medium test item with error",
      "Virheiden lukumäärä tekstissä": 2,
      "Virheelliset sanat": "test",
      "Oikeat sanat": "test",
    },
  ],
  2: [
    {
      "Virheetön teksti": "Hard test item",
      "Virheellinen teksti, virheet punaisella": "Hard test item with error",
      "Virheiden lukumäärä tekstissä": 3,
      "Virheelliset sanat": "test",
      "Oikeat sanat": "test",
    },
  ],
};

export function GamePageGameOne() {
  const location = useLocation();
  const difficulty = location.state?.state || "0";

  const [game, setGame] = useState(null);
  const [isPhaseOne, setIsPhaseOne] = useState(true);

  const fetchNewTask = useCallback(() => {
    const tehtavalista = TASOT[difficulty];

    if (tehtavalista && tehtavalista.length > 0) {
      const randomIndex = Math.floor(Math.random() * tehtavalista.length);
      setGame(tehtavalista[randomIndex]);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchNewTask();
  }, [difficulty, fetchNewTask]);

  const handleRestart = () => {
    setIsPhaseOne(true);
    fetchNewTask();
  };

  return (
    <div className="game-page">
      {isPhaseOne ? (
        <GameOnePhaseOne data={game} />
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
