import { useLocation } from "react-router-dom";

export function GamePageGameOne() {
  const location = useLocation();

  const difficulty = location.state.state || "0";

  return <p>peli {difficulty}</p>;
}
