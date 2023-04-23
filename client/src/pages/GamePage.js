import { useState, useEffect } from "react";
import Game from "../components/Game";
import Rules from "../components/Rules";
import CurrentUserStats from "../components/CurrentUserStats";
import axios from "axios";
import { Navigate } from "react-router-dom";

    

function GamePage() {
  const [showGame, setShowGame] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleStartButton = (e) => {
    setShowGame(true);
  };

  const showFinalStats = () => {
    setShowStats(true);
  };

 
  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URI+'/is_linked',{withCredentials:true}).then((data) => {
      console.log("GamePage",data)
      if (data === true) {
        <Navigate to="/play" />;
      } else {
        <Navigate to="/login" />;
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
