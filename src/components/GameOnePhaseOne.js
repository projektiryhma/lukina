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

export function GameOnePhaseOne({ data, allFound }) {
  const navigate = useNavigate();
  const [selectedIndices, setSelectedIndices] = useState([]);

  useEffect(() => {
    setSelectedIndices([]);
  }, [data]);

  if (!data) return <p>Ei dataa saatavilla</p>;

  const originalText = data["Virheellinen teksti, virheet punaisella"];
  const amountOfErrors = data["Virheiden lukumäärä tekstissä"];
  const incorrectWordsString = data["Virheelliset sanat"];

  const incorrectWordsList = incorrectWordsString
    .split(",")
    .map((word) => word.trim());

  const words = originalText.split(/\s+/).filter((word) => word.length > 0);

  const handleWordClick = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleCheckClick = () => {
    const rightChoices = selectedIndices.filter((index) => {
      const wordWithoutPunctuation = words[index].replace(/[.,!?;:]/g, "");
      return incorrectWordsList.includes(wordWithoutPunctuation);
    });

    setSelectedIndices(rightChoices);

    if (rightChoices.length === amountOfErrors) {
      allFound(rightChoices);
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

      <h1 className="PhaseOneHeader">Vaihe 1 - Lue ja etsi</h1>

      <p className="phaseoneinfotext">
        Lue teksti. <br />
        Valitse mielestäsi virheellisesti kirjoitetut <br /> sanat.
      </p>

      <div className="container">
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
        <button onClick={handleCheckClick} className="CheckButton">
          Tarkista
        </button>
      </div>

      <h2 className="phaseoneheader2">Tarvitsetko apua?</h2>
      <p className="phaseonehelptext">
        Voit pyytää vihjeen, joka näyttää, kuinka monta väärin kirjoitettua
        sanaa tekstissä on. Voit myös pyytää jotakuta lukemaan tekstin sinulle
        ääneen tai vaihtataa tehtävän tekstin toiseen.
      </p>
      <button onClick={handleCheckClick} className="CheckButton">
        Näytä vihje
      </button>
    </div>
  );
}

GameOnePhaseOne.propTypes = {
  data: PropTypes.shape({
    "Virheellinen teksti, virheet punaisella": PropTypes.string,
    "Virheiden lukumäärä tekstissä": PropTypes.number,
    "Virheelliset sanat": PropTypes.string,
  }).isRequired,
  allFound: PropTypes.func.isRequired,
};
