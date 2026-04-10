import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal } from "./UniversalModal.js";
import "./GameOnePhaseTwo.css";

export function GameOnePhaseTwo({ data, onPhaseComplete }) {
  const wrongWordCount = Number(data?.["Virheiden lukumäärä tekstissä"] ?? 1) || 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [userInputs, setUserInputs] = useState(() => Array.from({ length: wrongWordCount }, () => ""));
  const [isComplete, setIsComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalButton, setModalButton] = useState("");
  const [isCorrect, setIsCorrect] = useState(null); // null initially, true/false after check

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentInput("");
    setIsComplete(false);
    setUserInputs(Array.from({ length: wrongWordCount }, () => ""));
    setIsCorrect(null);
  }, [wrongWordCount]);

  if (!data) return <p>No data</p>;

  const text = data["Virheellinen teksti, virheet punaisella"];
  const faultyWordsString = data["Virheelliset sanat"] || "";
  const faultyWords = faultyWordsString
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
  const correctWordsString = data["Oikeat sanat"] || "";
  const correctWords = correctWordsString
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  const currentWord = faultyWords[currentIndex] || "";
  const currentCorrectWord = correctWords[currentIndex] || "";

  const handleCheckClick = () => {
    const userInput = currentInput.trim();
    const correct = currentCorrectWord.toLowerCase() === userInput.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setModalTitle("Oikein!");
      setModalMessage("Sana oikein. Jatka seuraavaan sanaan.");
      setModalButton("Jatka");
    } else {
      setModalTitle("Väärin!");
      setModalMessage("Sana on väärin. Voit tarvittaessa pyytää vihjeen.");
      setModalButton("Jatka");
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (isCorrect) {
      const nextInputs = [...userInputs];
      nextInputs[currentIndex] = currentInput.trim();
      setUserInputs(nextInputs);

      if (currentIndex + 1 < faultyWords.length) {
        setCurrentIndex((prev) => prev + 1);
        setCurrentInput("");
        setIsCorrect(null);
      } else {
        setIsComplete(true);
        if (onPhaseComplete) {
          onPhaseComplete(nextInputs);
        }
      }
    }
  };

  return (
    <div className="phase-two">
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
                onChange={(e) => {
                  setCurrentInput(e.target.value);
                  if (isCorrect === false) setIsCorrect(null);
                }}
                placeholder="kirjoita sana tähän"
                maxLength={30}
              />
              {isCorrect === false && <p className="error-label">Kirjoita sana oikein.</p>}
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
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalTitle}
        button={modalButton}
        size="small"
      >
        <p>{modalMessage}</p>
      </Modal>
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
