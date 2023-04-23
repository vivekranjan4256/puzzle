import './rules.css'
function Rules({startButton}) {
  return (
    <>
     <div className="rules">
      <div className="card text-center">
        <div className="card-header"> <h5 className="card-title">
        Please read these rules carefully before proceeding to the game.
          </h5></div>


        <div className="card-body">
         
{/* 1. There are 12 levels in the game.
2. Answer of all these levels are name of the country.
3. Click on Start Exploring on the next page to start the game.
4. Upon clicking on start exploring google earth will open in new tab.
5. There will be several marked places on the map.
6. Start from India and based on hints given which can be image or video or meme guess the name of the next country.
7. Enter the guessed name in the input field of the current level.
8. If your guess is correct you will move to the next level.
9. Upon moving to the next level go the country which you guessed in google map which contains hint for next country.
10. Complete all the levels to win the game. */}
          <p className="card-text">
            Catch mukhiya at marathon.
          </p>
          <p className="card-text">
            Click pictures of mukhiya offering maaza.
          </p>

          <button onClick={startButton} className='btn btn-primary'>Start game</button>
        </div>
        {/* <div className="card-footer text-body-secondary">2 days ago</div> */}
      </div>
      </div>
    </>
  );
}

export default Rules;
