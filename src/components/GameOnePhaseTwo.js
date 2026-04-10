import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "./UniversalModal";
import "./GameOnePhaseTwo.css";

export function GameOnePhaseTwo({ data, onPhaseComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [userInputs, setUserInputs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const text = data?.["Virheellinen teksti, virheet punaisella"] || "";
  const faultyWordsString = data?.["Virheelliset sanat"] || "";
  const correctWordsString = data?.["Oikeat sanat"] || "";
  
  const faultyWords = faultyWordsString
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  const correctWords = correctWordsString
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  const wrongWordCount = Math.max(faultyWords.length, 1);

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentInput("");
    setIsComplete(false);
    setUserInputs(Array.from({ length: wrongWordCount }, () => ""));
  }, [wrongWordCount]);

  if (!data) return <p>No data</p>;

  const currentWord = faultyWords[currentIndex] || "";
  const currentCorrectWord = correctWords[currentIndex] || "";

  const handleCheckClick = () => {
    const trimmedInput = currentInput.trim();
    const isCorrect = trimmedInput.toLowerCase() === currentCorrectWord.toLowerCase();

    if (isCorrect) {
      setIsAnswerCorrect(true);
      setErrorMessage("");
    } else {
      setIsAnswerCorrect(false);
      setErrorMessage("Kirjoita sana oikein.");
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    if (isAnswerCorrect) {
      const nextInputs = [...userInputs];
      nextInputs[currentIndex] = currentInput.trim();
      setUserInputs(nextInputs);

      if (currentIndex + 1 < faultyWords.length) {
        setCurrentIndex((prev) => prev + 1);
        setCurrentInput("");
      } else {
        setIsComplete(true);
        if (onPhaseComplete) {
          onPhaseComplete(nextInputs);
        }
      }
    }
    setModalOpen(false);
  };

  return (
    <div className="phase-two">
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={isAnswerCorrect ? "Oikea vastaus!" : "Väärä vastaus"}
        button="Jatka"
      >
        <div>
          {isAnswerCorrect ? (
            <p>Sana oikein. Jatka seuraavaan sanaan.</p>
          ) : (
            <>
              <p>Sana on väärin. Voit tarvittaessa pyytää vihjeen.</p>
              {errorMessage && <p style={{ color: "red", fontWeight: "600" }}>{errorMessage}</p>}
            </>
          )}
        </div>
      </Modal>
      <h2>Vaihe 2: Lue ja korjaa</h2>
      <p className="GameData">{text}</p>
      <div className="word-boxes">
        <p>Kirjoita korjaukset:</p>
        <div className="word-boxes-wrapper">
          {!isComplete ? (
            <div className="word-input-group">
              <p className="progress">{`${currentIndex + 1} / ${faultyWords.length}`}</p>
              <p className="faulty-word">{currentWord}</p>
              <input
                type="text"
                className="word-input"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="kirjoita sana tähän"
                maxLength={30}
              />
              <button className="check-button" onClick={handleCheckClick}>
                Tarkista
              </button>
            </div>
          ) : (
            <div className="completion-box">
              <p>Hyvin tehty! Kaikki sanat on läpikäyty.</p>
              <p className="completion-note">Paina Uusi jatkaaksesi seuraavaan tehtävään.</p>
            </div>
          )}
        </div>
      </div>
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
    "Virheelliset sanat": PropTypes.string,
    "Oikeat sanat": PropTypes.string,
  }).isRequired,
  onPhaseComplete: PropTypes.func,
};
