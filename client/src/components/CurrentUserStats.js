import { useState } from "react";
import Confetti from "react-confetti";

function CurrentUserStats() {
  const [showConfetti, setShowConfetti] = useState(true);

  setTimeout(() => {
    setShowConfetti(false);
  }, 10 * 1000);
  return (
    <>
      <h1>Mukhiya</h1>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={600}
        />
      )}
    </>
  );
}

export default CurrentUserStats;
