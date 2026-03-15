import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./GameOnePhaseOne.css";

function Word({ text, isSelected, onClick }) {
  return (
    <span
      onClick={onClick}
      className={`interactive-word ${isSelected ? "is-selected" : ""}`}
    >
      {text}
    </span>
  );
}

Word.propTypes = {
  text: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export function GameOnePhaseOne({ data }) {
  const navigate = useNavigate();

  const [selectedIndices, setSelectedIndices] = useState([]);

  //Reset
  useEffect(() => {
    setSelectedIndices([]);
  }, [data]);

  if (!data) return <p>Ei dataa saatavilla</p>;

  const originalText = data["Virheellinen teksti, virheet punaisella"];
  const amountOfErrors = data["Virheiden lukumäärä tekstissä"];

  // split original data
  const words = originalText.split(/\s+/).filter((word) => word.length > 0);

  const handleWordClick = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  return (
    <div className="phase-one">
      <button
        onClick={() => navigate("/InfoPageGameOne")}
        className="BackToButton"
      >
        &lt; Edellinen
      </button>

      <h2 className="PhaseOneHeader">Etsi ja korjaa</h2>

      <div className="word-container">
        {words.map((word, index) => (
          <Word
            key={index}
            text={word}
            isSelected={selectedIndices.includes(index)}
            onClick={() => handleWordClick(index)}
          />
        ))}
      </div>

      <p className="error-info">
        Valittu: <strong>{selectedIndices.length}</strong> / {amountOfErrors}
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
