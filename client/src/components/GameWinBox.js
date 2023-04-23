import React, { useEffect } from "react";
import Confetti from "react-confetti";
import { useState } from "react";
import "../styles.css";
import axios from "axios";

function GameWinBox({curUserFinalStats}) {
console.log('Game win box',curUserFinalStats)
    const [showConfetti, setShowConfetti] = useState(true);
    const [rank,setrank]=useState(-1)
  setTimeout(() => {
    setShowConfetti(false);
  }, 10 * 1000);

  useEffect(()=>{
    axios
    .get(process.env.REACT_APP_BACKEND_URI + "/all_user_stats")
    .then((resp) => {
      let rk=(resp.data).findIndex(user=>user.email==curUserFinalStats.email)
      console.log("all user stats resp", resp.data,rk+1);
      setrank(rk+1)
    })
    .catch((err) => console.log("all user stats fn adminPage err", err));
   
  },[])



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
        <p>Total time taken: {curUserFinalStats.total_time} seconds</p>
        
        
  </div>
  </div>
  );
}

export default GameWinBox;