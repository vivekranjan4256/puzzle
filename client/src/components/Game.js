import React from "react";
import { useState, useRef, useEffect } from "react";
import "../styles.css";
import CurrentUserStats from "./CurrentUserStats";


function Game({showFinalStats}) {
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
    "Hong Kong",
    "India",
  ]);

  const [time, setTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);
  const [timePassed, setTimePassed] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [gameOver, setGameOver] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  // const startCelebrating = () => {
  //   setIsCelebrating(true);
  //   setTimeout(() => setIsCelebrating(false), 7000);
  // };

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

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // console.log(arr[index]);
      if (event.target.value === arr[index]) {
        timePassed[index] = (time - now) / 1000;
        handleStop();
        if (index === 1) {
          setGameOver(true);
          
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
