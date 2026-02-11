import "./InfoPageGameOne.css"
import { useNavigate } from 'react-router-dom';

export function InfoPageGameOne(){

    const navigate = useNavigate();

    const handleButtonClick = (difficulty) => {
        navigate("/GamePageGameOne", { state: { state: difficulty } });
    };

    return(

        <>
            <p className="InfoHeader"> Etsi ja korjaa </p>

            <p className="InfoText">Liirun laarum lopun</p>

            <p className="DifficultyText">Valitse tehtävän vaikeustaso</p>

            <button onClick={() => handleButtonClick('0') } className="DifButton">Helppo</button>
            <button onClick={() => handleButtonClick('1') } className="DifButton">Keskivaikea</button>
            <button onClick={() => handleButtonClick('2') } className="DifButton">Vaikea</button>

        </>

    )
}