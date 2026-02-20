import "./StartPage.css";
import { useNavigate } from "react-router-dom";

export function StartPage() {
  const navigate = useNavigate();

  const HandleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <p className="InfoHeader">Tervetuloa</p>
      <p className="InfoText">Liirum Laarum</p>
      <p className="SelectionText">Valitse seuraava sivu jatkaaksesi:</p>
      <button
        onClick={() => HandleNavigate("/InfoPageGameOne")}
        className="DifButton"
      >
        Info
      </button>
    </>
  );
}

export default StartPage;
