import "./rules.css";
function Rules({ startButton }) {
  return (
    <>
      <div className="rules">
        <div className="card text-center">
          <div className="card-header">
            {" "}
            <h5 className="card-title">
              Please read these rules carefully before proceeding to the game.
            </h5>
          </div>

          <div className="card-body">
            <p className="card-text">1. There are 12 levels in the game.</p>
            <p className="card-text">
              2. Answer of all these levels are name of the country.
            </p>
            <p className="card-text">
              3. Click on Start Exploring on the next page to start the game.
            </p>
            <p className="card-text">
              4. Upon clicking on start exploring google earth will open in new
              tab.
            </p>
            <p className="card-text">
              5. There will be several marked places on the map.
            </p>
            <p className="card-text">
              6. Start from India and based on hints given which can be image or
              video or meme guess the name of the next country.
            </p>
            <p className="card-text">
              7. Enter the guessed name in the input field of the current level.
            </p>
            <p className="card-text">
              8. If your guess is correct you will move to the next level.
            </p>
            <p className="card-text">
              9. Upon moving to the next level go the country which you guessed
              in google map which contains hint for next country.
            </p>
            <p className="card-text">
              10. Complete all the levels to win the game.
            </p>

            <button onClick={startButton} className="btn btn-primary">
              Start game
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Rules;
