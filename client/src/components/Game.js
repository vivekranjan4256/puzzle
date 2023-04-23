import React from "react";
import { useState, useRef, useEffect } from "react";
import "../styles.css";
import GameWinBox from "./GameWinBox";
import axios from "axios";

function Game({ showFinalStats, setCurUserFinalStats }) {
  const [names, setNames] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [attempts, setAttempts] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const inputRefs = useRef([]);
  const [arr, setArr] = useState([
    "Mongolia",
    "Germany",
    "New Zealand",
    "Somalia",
    "Australia",
    "South Korea",
    "Spain",
    "Japan",
    "Namibia",
    "Egypt",
    "China",
    "India",
  ]);

  const [time, setTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);
  const [timePassed, setTimePassed] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [gameOver, setGameOver] = useState(false);

  const handleStart = () => {
    setTime(Date.now());
    setNow(Date.now());
    intervalRef.current = setInterval(() => {
      setTime(Date.now());
    }, 10);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const send_user_stats = async () => {
    await axios
      .post(
        process.env.REACT_APP_BACKEND_URI + "/user_stats",
        { time_ar: timePassed, attempts_ar: attempts },
        { withCredentials: true }//using this as the source to get usermail
      )
      .then((res) => {
        console.log('send_user_stats',res.data)
        setCurUserFinalStats(res.data);
      })
      .catch((err) => {
        console.log("send_user_stats fn in Game", err);
      });
  };
  const handleKeyDown = async (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // console.log(arr[index]);
      if (event.target.value === arr[index]) {
        timePassed[index] = (time - now) / 1000;
        handleStop();
        if (index === 11) {
          setGameOver(true);
          await send_user_stats();
          showFinalStats();
        }
        setAttempts((prev) => {
          const newAttempts = [...prev];
          newAttempts[index] += 1;
          return newAttempts;
        });
        setNames((prev) => {
          const newNames = [...prev];
          newNames[index] = event.target.value;
          return newNames;
        });
        if (index < inputRefs.current.length - 1) {
          setCurrentInputIndex(index + 1);
        }
      } else if (event.target.value !== "") {
        event.target.value = "";
        setAttempts((prev) => {
          const newAttempts = [...prev];
          newAttempts[index] += 1;
          return newAttempts;
        });
      }
    }
  };

  const handleInputChange = (event, index) => {
    const currentValue = event.target.value;
    const newNames = [...names];
    newNames[index] = currentValue;
    setNames(newNames);
  };

  const handleInputClick = (index) => {
    handleStart();
    if (index === currentInputIndex) {
      inputRefs.current[index].focus();
    }
  };

  return (
    <div id="top">
      <div>
        <a
          className="btn btn-outline-primary"
          href="https://earth.google.com/web/data=MicKJQojCiExdWxYODNWVkxBVnVZWUpfMk1KcWtDNE5RN2VyOEJjaUU6AwoBMA?authuser=0"
          target="blank"
          id="googleearth"
        >
          Start Exploring
        </a>
      </div>
      <div className="outerbox grid-container">
        {arr.map((country, index) => (
          <div key={index} className="grid-item">
            <h3>Level {index + 1}</h3>
            <input
              className="attemptbox"
              type="text"
              placeholder={`Enter name ${index + 1}`}
              value={names[index]}
              onChange={(event) => handleInputChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onClick={() => handleInputClick(index)}
              disabled={
                index !== currentInputIndex
                // ||
                // (index > 0 && names[index - 1] !== arr[index])
              }
              ref={(el) => (inputRefs.current[index] = el)}
            />
            <p>Attempts: {attempts[index]}</p>
            <p>Time: {timePassed[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
