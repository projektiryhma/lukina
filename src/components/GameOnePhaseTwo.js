import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./GameOnePhaseTwo.css";

export function GameOnePhaseTwo({ data, onPhaseComplete }) {
  const wrongWordCount = Number(data?.["Virheiden lukumäärä tekstissä"] ?? 1) || 1;
  const [userInputs, setUserInputs] = useState(() => Array.from({ length: wrongWordCount }, () => ""));

  useEffect(() => {
    setUserInputs(Array.from({ length: wrongWordCount }, () => ""));
  }, [wrongWordCount]);

  if (!data) return <p>No data</p>;

  const text = data["Virheellinen teksti, virheet punaisella"];


  const handleInputChange = (index, value) => {
    setUserInputs((prevInputs) => {
      const nextInputs = [...prevInputs];
      nextInputs[index] = value;
      return nextInputs;
    });
  };

  const handleCheckClick = () => {
    if (onPhaseComplete) {
      onPhaseComplete(userInputs);
    }
  };

  return (
    <div className="phase-two">
      <h2>Vaihe 2: Lue ja korjaa</h2>
      <p className="GameData">{text}</p>
      <div className="word-boxes">
        <p>Kirjoita korjaukset:</p>
        <div className="word-boxes-wrapper">
          {userInputs.map((value, index) => (
            <input
              key={index}
              type="text"
              className="word-input"
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="kirjoita sana tähän"
              maxLength={30}
            />
          ))}
        </div>
      </div>
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
