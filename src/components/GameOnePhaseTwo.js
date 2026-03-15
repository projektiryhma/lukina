import { useState } from "react";
import PropTypes from "prop-types";
import "./GameOnePhaseTwo.css";

export function GameOnePhaseTwo({ data, onPhaseComplete }) {
  const [userInput, setUserInput] = useState("");

  if (!data) return <p>No data</p>;

  const text = data["Virheellinen teksti, virheet punaisella"];

  const handleCheckClick = () => {
    if (onPhaseComplete) {
      onPhaseComplete(userInput);
    }
  };

  return (
    <div className="phase-two">
      <h2>Vaihe 2: Lue ja korjaa</h2>
      <p className="GameData">{text}</p>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Kirjoita korjattu teksti tähän..."
        rows="6"
        cols="50"
      />
      <button onClick={handleCheckClick}>Tarkista</button>
      <div className="help-section">
        <p className="help-title">Tarvitsetko apua?</p>
        <p className="help-text">Voit katsoa sanan oikein kirjoitettuna.</p>
        <button className="help-button">Katso sana</button>
      </div>
    </div>
  );
}

GameOnePhaseTwo.propTypes = {
  data: PropTypes.shape({
    "Virheellinen teksti, virheet punaisella": PropTypes.string,
    "Virheiden lukumäärä tekstissä": PropTypes.number,
  }).isRequired,
  onPhaseComplete: PropTypes.func,
};
