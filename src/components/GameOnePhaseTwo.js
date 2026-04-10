import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "./UniversalModal";
import "./GameOnePhaseTwo.css";

export function GameOnePhaseTwo({ data, onPhaseComplete, onChangeText }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [userInputs, setUserInputs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hintModalOpen, setHintModalOpen] = useState(false);

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
    
    if (trimmedInput === "") {
      setErrorMessage("Kirjoita sana oikein.");
      return;
    }

    const isCorrect = trimmedInput.toLowerCase() === currentCorrectWord.toLowerCase();

    if (isCorrect) {
      setIsAnswerCorrect(true);
      setErrorMessage("");
    } else {
      setIsAnswerCorrect(false);
      setErrorMessage("");
    }
    setModalOpen(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCheckClick();
    }
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

  const handleHintClick = () => {
    setHintModalOpen(true);
  };

  const renderTextWithBoldWord = () => {
    if (!currentWord) return text;
    
    const regex = new RegExp(`(${currentWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      part.toLowerCase() === currentWord.toLowerCase() ? 
        <strong key={index}>{part}</strong> : 
        part
    );
  };

  return (
    <div className="phase-two">
      <Modal
        isOpen={hintModalOpen}
        onClose={() => setHintModalOpen(false)}
        title="Vihje"
        button="Sulje"
      >
        <div>
          <p id="hint-description">Näin kirjoitat sanan oikein</p>
          <p style={{ fontWeight: "600", fontSize: "18px", marginTop: "12px" }} aria-describedby="hint-description">
            {currentCorrectWord}
          </p>
        </div>
      </Modal>
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
            <p>Sana on väärin. Voit tarvittaessa pyytää vihjeen.</p>
          )}
        </div>
      </Modal>
      <h1>Vaihe 2: Lue ja korjaa</h1>
      <p className="GameData">{renderTextWithBoldWord()}</p>
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
                  if (errorMessage) setErrorMessage("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="kirjoita sana tähän"
                maxLength={30}
              />
              {errorMessage && <p style={{ color: "red", fontWeight: "600", marginTop: "8px" }}>{errorMessage}</p>}
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
        <h2 className="help-title">Tarvitsetko apua?</h2>
        <p className="help-text">Voit katsoa sanan oikein kirjoitettuna.</p>
        <button className="help-button" onClick={handleHintClick}>Näytä vihje</button>
        {onChangeText && <button className="help-button" onClick={onChangeText}>Vaihda tekstiä</button>}
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
  onChangeText: PropTypes.func,
};
