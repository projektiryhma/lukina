import { useNavigate } from 'react-router-dom';
import './StartPage.css';

function StartPage() {
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
      <button onClick={() => handleNavigate('/GamePageGameOne')} className="DifButton">Aloita peli</button>
    </>
  );
}

export default StartPage;
