import React from "react";
import { useState, useEffect } from "react";
import Game from "../components/Game";
import Rules from "../components/Rules";
import CurrentUserStats from "../components/CurrentUserStats";

function GamePage() {
  const [showGame, setShowGame] = useState(false);
  const [showStats,setShowStats]=useState(false)

  const handleStartButton = (e) => {
    setShowGame(true);
  };

  const showFinalStats=()=>
  {
  setShowStats(true)
  }

  return (
    <div>
      {!showStats?(showGame ? <Game showFinalStats={showFinalStats} />:<Rules startButton={handleStartButton}/>):<CurrentUserStats/>}
    </div>
  );

}

export default GamePage;
