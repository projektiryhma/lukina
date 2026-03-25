import "./StartPage.css";
import { useNavigate } from "react-router-dom";

export function StartPage() {
  const navigate = useNavigate();

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
      <button onClick={() => HandleNavigate("/")} className="InfoButton">
        Lue ohjeet &gt;
      </button>

      <button onClick={() => HandleNavigate("/")} className="AppInfoButton">
        Tietoa sovelluksesta
      </button>
    </>
  );
}

export default StartPage;
