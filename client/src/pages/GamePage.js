import { useState, useEffect } from "react";
import Game from "../components/Game";
import Rules from "../components/Rules";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GameWinBox from "../components/GameWinBox";
import Cookies from "js-cookie";

function GamePage({ setVerified, setloggedin }) {
  const navigate = useNavigate();

  const [showGame, setShowGame] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [curUserFinalStats, setCurUserFinalStats] = useState({});

  const handleStartButton = (e) => {
    setShowGame(true);
  };

  const showFinalStats = () => {
    setShowStats(true);
  };

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_BACKEND_URI + "/is_logged",{
        cookie_present:(Cookies.get('puzzle_cookie')?true:false),
        puzzle_cookie: Cookies.get('puzzle_cookie'),
      })
      .then(async (resp) => {
        console.log('is_logged resp',resp)
        if (resp.data===true) {
          setloggedin(true)
           navigate("/play");
         
          await axios
            .post(process.env.REACT_APP_BACKEND_URI + "/is_admin", {
              cookie_present:(Cookies.get('puzzle_cookie')?true:false),
              puzzle_cookie: Cookies.get('puzzle_cookie'),
            })
            .then((respo) => {
              console.log('is_logged respo admin',respo)
              console.log("GamePage admin", respo.data);

              if (respo.data === true) {
                setVerified(true);
              } 
            });
        }
        else
        {
          navigate('/');
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <div>
      {!showStats ? (
        showGame ? (
          <Game
            showFinalStats={showFinalStats}
            setCurUserFinalStats={setCurUserFinalStats}
          />
        ) : (
          <Rules startButton={handleStartButton} />
        )
      ) : (
        <>
          {console.log(curUserFinalStats)}
          <GameWinBox curUserFinalStats={curUserFinalStats} />
        </>
      )}
    </div>
  );
}

export default GamePage;
