import { useState, useEffect } from "react";
import Game from "../components/Game";
import Rules from "../components/Rules";
import CurrentUserStats from "../components/CurrentUserStats";
import axios from "axios";
import { useNavigate } from "react-router-dom";

    

function GamePage(setVerified) {
  const navigate=useNavigate()


  const [showGame, setShowGame] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const handleStartButton = (e) => {
    setShowGame(true);
  };

  const showFinalStats = () => {
    setShowStats(true);
  };

 
  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URI+'/is_linked',{withCredentials:true}).then((resp) => {
      console.log("GamePage",resp.data)
      // setVerified(true)
      if (resp.data === true) {
        navigate("/play");
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <div>
      {!showStats ? (
        showGame ? (
          <Game showFinalStats={showFinalStats} />
        ) : (
          <Rules startButton={handleStartButton} />
        )
      ) : (
        <CurrentUserStats />
      )}
    </div>
  );
}

export default GamePage;
