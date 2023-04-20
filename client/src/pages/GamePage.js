import React from "react";
import { useState, useRef, useEffect } from "react";
// import './App.css'

function GamePage() {
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
  ]);
  const [attempts, setAttempts] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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
    "India",
  ]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // console.log(arr[index]);
      if (event.target.value === arr[index]) {
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
    if (index === currentInputIndex) {
      inputRefs.current[index].focus();
    }
  };

  return (
    <>
      <div id="wall">
        <a
          href="https://earth.google.com/web/data=MicKJQojCiExdWxYODNWVkxBVnVZWUpfMk1KcWtDNE5RN2VyOEJjaUU6AwoBMA?authuser=0"
          target="blank"
          id="googleearth"
        >
          Start Exploring
        </a>
      </div>
      <div className="outerbox row">
        {arr.map((country, index) => (
          <div key={index}>
            <div className="col-sm-6 mb-3 mb-sm-0">
              <div className="card">
                <div className="card-body">
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default GamePage;
