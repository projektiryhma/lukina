import "./StartPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "../components/UniversalModal.js";
import { GameInstructionsModal } from "../components/GameInstructionsModal.js";
import { AppInfoModal } from "../components/AppInfoModal.js";

export function StartPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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
      <button
        onClick={() => {
          setModalContent("instructions");
          setIsModalOpen(true);
        }}
        className="InfoButton"
      >
        Lue ohjeet &gt;
      </button>

      <button
        onClick={() => {
          setModalContent("info");
          setIsModalOpen(true);
        }}
        className="AppInfoButton"
      >
        Tietoa sovelluksesta
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalContent(null);
        }}
        title={
          modalContent === "instructions"
            ? "Pelin ohjeet"
            : "Tietoa sovelluksesta"
        }
        button="Sulje"
        size="large"
      >
        {modalContent === "instructions" ? (
          <GameInstructionsModal />
        ) : (
          <AppInfoModal />
        )}
      </Modal>
    </>
  );
}

export default StartPage;
