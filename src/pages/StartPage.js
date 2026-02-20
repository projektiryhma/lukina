import { useNavigate } from 'react-router-dom';
import './StartPage.css';

export function StartPage() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <p className="InfoHeader">Tervetuloa</p>
      <p className="InfoText">Liirum Laarum</p>
      <p className="SelectionText">Valitse seuraava sivu jatkaaksesi:</p>
      <button onClick={() => handleNavigate('/InfoPageGameOne')} className="DifButton">Info</button>
    </>
  );
}

export default StartPage;
