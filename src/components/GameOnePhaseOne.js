import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./GameOnePhaseOne.css";

export function GameOnePhaseOne({ data }) {
  const navigate = useNavigate();
  if (!data) return <p>No data</p>;

  const text = data["Virheellinen teksti, virheet punaisella"];
  const amountoferror = data["Virheiden lukumäärä tekstissä"];

  return (
    <div className="phase-one">
      <button
        onClick={() => navigate("/InfoPageGameOne")}
        className="BackToButton"
      >
        &lt; Edellinen
      </button>
      <h2 className="PhaseOneHeader">Etsi ja korjaa</h2>
      <p className="GameData">{text}</p>
      <p>
        Virheitä: <strong className="ErrorAmount">{amountoferror}</strong>
      </p>
    </div>
  );
}

GameOnePhaseOne.propTypes = {
  data: PropTypes.shape({
    "Virheellinen teksti, virheet punaisella": PropTypes.string,
    "Virheiden lukumäärä tekstissä": PropTypes.number,
  }).isRequired,
};
