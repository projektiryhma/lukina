import "./NotFoundPage.css";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  const HandleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <p className="NotFoundHeader">Hups, valitsemaasi sivua ei löydy</p>
      <button onClick={() => HandleNavigate("/")} className="NotFoundButton">
        Takaisin etusivulle &gt;
      </button>
    </>
  );
}

export default NotFoundPage;
