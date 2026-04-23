import "./InfoPageGameOne.css";
import { useNavigate } from "react-router-dom";

export function InfoPageGameOne() {
  const navigate = useNavigate();

  const handleButtonClick = (difficulty) => {
    sessionStorage.setItem("difficulty", difficulty);
    navigate("/GamePageGameOne");
  };

  return (
    <>
      <button onClick={() => navigate("/")} className="BackButton">
        &lt; Etusivulle
      </button>

      <p className="InfoHeader"> Etsi ja korjaa </p>

      <p className="InfoText">
        Tehtävän avulla harjoittelet virheellisesti kirjoitettujen sanojen
        etsimistä ja niiden korjaamista.
      </p>

      <p className="InfoText2">Voit valita tehtävän vaikeustason.</p>

      <p className="DifficultyText">
        Valitse tehtävän vaikeustaso ja aloita tehtävä
      </p>

      <p className="DifficultyButtonText">Lyhyt: 1-2 virkkeen tekstit</p>
      <button onClick={() => handleButtonClick("0")} className="DifButton">
        Lyhyt
      </button>

      <p className="DifficultyButtonText">Keskipitkä: 3-4 virkkeen tekstit</p>
      <button onClick={() => handleButtonClick("1")} className="DifButton">
        Keskipitkä
      </button>

      <p className="DifficultyButtonText">
        Pitkä: 5 tai useamman virkkeen tekstit
      </p>
      <button onClick={() => handleButtonClick("2")} className="DifButton">
        Pitkä
      </button>
    </>
  );
}
