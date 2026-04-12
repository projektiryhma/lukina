import "./EndPage.css";
import { useNavigate } from "react-router-dom";

export function EndPage() {
  const navigate = useNavigate();

  return (
    <div className="EndPageDiv">
      <button onClick={() => navigate("/")} className="BackToButton">
        &lt; Etusivulle
      </button>
      <h1 className="eph1">Tehtävä on suoritettu!</h1>
      <p>Haluatko jatkaa tehtäviä vai siirtyä etusivulle?</p>

      <button
        onClick={() => navigate("/GamePageGameOne")}
        className="EndButton"
      >
        Jatka &gt;
      </button>

      <button onClick={() => navigate("/")} className="EndButton">
        Etusivulle &gt;
      </button>
    </div>
  );
}
