import "./StartPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "../components/UniversalModal.js";

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
        <div className="instructions-modal-content">
          <h2>Pelin pikaohjeet</h2>
          <h4>Vaihe 1 - Lue ja etsi</h4>
          <p>----- </p>
          <p>----- </p>
          <h3>Pelin tarkemman ohjeet</h3>
          <p>1. Lue annettu teksti huolellisesti.</p>
          <p>2. Klikkaa sanoja, jotka on kirjoitettu väärin.</p>
          <p>3. Paina Tarkista nähdäksesi tulokset.</p>
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            <strong>Vinkki:</strong> Voit pyytää vihjeen, jos et löydä kaikkia
            virheitä!
          </div>
        </div>
      </Modal>
    </>
  );
}

export default StartPage;
