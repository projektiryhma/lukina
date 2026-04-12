import "./StartPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "../components/UniversalModal.js";
import { GameInstructionsModal } from "../components/GameInstructionsModal.js";

export function StartPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const HandleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <p className="StartHeader">Harjoittele ja kehity</p>
      <p className="StartText">
        LUKINA:n avulla voit harjoitella oikeinkirjoitusta ja lukemista.
      </p>
      <p className="h2">Opi pelaamalla</p>

      <button
        onClick={() => HandleNavigate("/InfoPageGameOne")}
        className="StartButton"
      >
        Aloita pelaaminen &gt;
      </button>

      <p className="GameInfoText">Pelin ohjeet</p>
      <button onClick={() => setIsModalOpen(true)} className="InfoButton">
        Lue ohjeet &gt;
      </button>

      <button onClick={() => HandleNavigate("/")} className="AppInfoButton">
        Tietoa sovelluksesta
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pelin ohjeet"
        button="Sulje"
        size="large"
      >
        <GameInstructionsModal />
      </Modal>
    </>
  );
}

export default StartPage;
