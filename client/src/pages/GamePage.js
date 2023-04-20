import React from "react";
import { useState, useRef, useEffect } from "react";

function InputBoxes() {
  const [names, setNames] = useState(["", "", "", ""]);
  const [attempts, setAttempts] = useState([0, 0, 0, 0]);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.target.value === "vivek") {
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
    <div>
      {names.map((name, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Enter name ${index + 1}`}
            value={name}
            onChange={(event) => handleInputChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onClick={() => handleInputClick(index)}
            disabled={
              index !== currentInputIndex ||
              (index > 0 && names[index - 1] !== "vivek")
            }
            ref={(el) => (inputRefs.current[index] = el)}
          />
          <p>Attempts: {attempts[index]}</p>
        </div>
      ))}
    </div>
  );
}

export default InputBoxes;
