import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getFromStore } from "../db/dataCache";
import { GameOnePhaseOne } from "../components/GameOnePhaseOne.js";
import "./GamePageGameOne.css";

export function GamePageGameOne() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = String(location.state?.state || "0");

  const [isPhaseOne, setIsPhaseOne] = useState(true);

  const {
    data: game,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["task", difficulty],
    queryFn: async () => {
      const task = await getFromStore(difficulty);
      if (!task) throw new Error("No task found");
      return task;
    },
  });

  const handleRestart = () => {
    setIsPhaseOne(true);
    refetch();
  };

  const handlePhaseOneComplete = () => {
    setIsPhaseOne(false);
  };

  return (
    <div className="game-page">
      <button
        className="BackToButton"
        onClick={() => navigate("/InfoPageGameOne")}
      >
        &lt; Edellinen
      </button>
      <div className="feedback-area">
        {isLoading ? <CircularProgress className="loading-spinner" /> : null}
        {!isLoading && isError ? <p>Tehtävää ei voitu ladata.</p> : null}
      </div>
      {!isLoading && !isError && isPhaseOne ? (
        <>
          <GameOnePhaseOne data={game} allFound={handlePhaseOneComplete} />
          <button className="RestartButton" onClick={handleRestart}>
            Vaihda tekstiä
          </button>
        </>
      ) : (
        <>
          <button onClick={handleRestart}>Uusi</button>
        </>
      )}
    </div>
  );
}
