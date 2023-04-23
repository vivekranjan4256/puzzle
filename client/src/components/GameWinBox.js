import React from "react";
import Confetti from "react-confetti";
import { useState } from "react";
import "../styles.css";
function GameWinBox({curUserFinalStats}) {
console.log('Game win box',curUserFinalStats.time)
    const [showConfetti, setShowConfetti] = useState(true);

  setTimeout(() => {
    setShowConfetti(false);
  }, 10 * 1000);
    const rank=2;


  return (
    <div>
    {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={600}
        />
      )}
    <div className="congrats-box">
        <h2>!!! &nbsp; &nbsp; Congratulations   &nbsp; &nbsp; !!!</h2>
        <br />
        <h3>You are the winner</h3>
        <br /><br />
        <p>Rank: {rank}</p>
        <p>Accuracy: {curUserFinalStats.accuracy}%</p>
        <p>Total time taken: {curUserFinalStats.time} seconds</p>
        
        
  </div>
  </div>
  );
}

export default GameWinBox;