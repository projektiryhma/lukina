import "./GameOnePhaseThree.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export function GameOnePhaseThree({ data }) {
  const navigate = useNavigate();
  const correctText = data["Virheetön teksti"];

  return (
    <div className="p3div">
      <h1 className="p3h1">Vaihe 3 - Lue korjattu teksti</h1>
      <p className="p3infotext">
        Lue vielä korjattu teksti. Voit lukea tekstin joko hiljaa mielessäsi tai
        ääneen. Voit myös pyytää, että joku muu lukisi tekstin sinulle.
      </p>

      <div className="p3datatext">
        <p>{correctText}</p>
      </div>

      <button onClick={() => navigate("/")} className="BackButton">
        &lt; Etusivulle
      </button>

      <button onClick={() => navigate("/endpage")} className="ContinueButton">
        Jatka &gt;
      </button>
    </div>
  );
}

GameOnePhaseThree.propTypes = {
  data: PropTypes.shape({
    "Virheetön teksti": PropTypes.string,
  }).isRequired,
};
