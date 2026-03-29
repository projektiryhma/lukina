import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./GameOnePhaseTwo.css";

export function GameOnePhaseTwo({ data, onPhaseComplete }) {
  const wrongWordCount = Number(data?.["Virheiden lukumäärä tekstissä"] ?? 1) || 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [userInputs, setUserInputs] = useState(() => Array.from({ length: wrongWordCount }, () => ""));
  const [isComplete, setIsComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalContinueAction, setModalContinueAction] = useState(() => () => {});
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentInput("");
    setIsComplete(false);
    setUserInputs(Array.from({ length: wrongWordCount }, () => ""));
  }, [wrongWordCount]);

  if (!data) return <p>No data</p>;

  const text = data["Virheellinen teksti, virheet punaisella"];
  const faultyWordsString = data["Virheelliset sanat"] || "";
  const correctWordsString = data["Oikeat sanat"] || "";

  const faultyWords = faultyWordsString
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  const correctWords = correctWordsString
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);

  const currentWord = faultyWords[currentIndex] || "";
  const currentCorrectWord = correctWords[currentIndex] || "";

  const handleCheckClick = () => {
    const userValue = currentInput.trim();
    if (!userValue) {
      setInputError("Kirjoita sana oikein.");
      return;
    }

    setInputError("");

    const normalizedUser = userValue.toLowerCase();
    const normalizedCorrect = currentCorrectWord.toLowerCase();
    const isCorrect = normalizedUser === normalizedCorrect;

    setModalMessage(
      isCorrect
        ? "Sana oikein. Jatka seuraavaan sanaan."
        : "Sana on väärin. Voit tarvittaessa pyytää vihjeen."
    );

    const nextInputs = [...userInputs];
    nextInputs[currentIndex] = userValue;
    setUserInputs(nextInputs);

    setModalContinueAction(() => () => {
      setShowModal(false);
      if (currentIndex + 1 < faultyWords.length) {
        setCurrentIndex((prev) => prev + 1);
        setCurrentInput("");
      } else {
        setIsComplete(true);
        if (onPhaseComplete) {
          onPhaseComplete(nextInputs);
        }
      }
    });

    setShowModal(true);
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
              <label htmlFor="correction-input" className="input-label">
                Korjaa sana
              </label>
              <input
                id="correction-input"
                type="text"
                className="word-input"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Kirjoita sana tähän"
                maxLength={30}
                aria-label="Korjaa sana"
                aria-describedby={inputError ? "input-hint input-error-text" : "input-hint"}
              />
              <p id="input-hint" className="input-hint">
                Kirjoita sana oikein.
              </p>
              {inputError ? (
                <p id="input-error-text" className="input-error" role="alert">
                  {inputError}
                </p>
              ) : null}
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
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <h3 id="modal-title">Tarkistus</h3>
            <p className="modal-message">{modalMessage}</p>
            <button className="modal-button" onClick={modalContinueAction}>
              Jatka
            </button>
          </div>
        </div>
      )}
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
