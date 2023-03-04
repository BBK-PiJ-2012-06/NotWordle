import { useEffect, useContext, useState } from "react";

import "./Row.css";
import Box from "./Box";
import { GameContext } from "./BWordle";

function Row({ id, activeRow, submitGuess }) {
  //const [game, setGame] = useContext(GameContext);
  const [word, setWord] = useState([" ", " ", " ", " ", " "]);
  const [activeBox, setActiveBox] = useState(-1);
  const [isDisabled, setIsDisabled] = useState(true);
  const [result, setResult] = useState([
    "default",
    "default",
    "default",
    "default",
    "default",
  ]);

  useEffect(() => {
    if (id === activeRow) {
      setIsDisabled(false);
      setActiveBox(0);
    } else setIsDisabled(true);
  }, [id, activeRow]);

  function handleRowInput(event) {
    if (event.key === "Enter") {
      var result = submitGuess(word);
      if (result) setResult(result);
    }
    if (event.key === "Backspace") {
      console.log(
        "row handle backspace, updating active box to be " + (activeBox - 1)
      );
      setActiveBox(activeBox - 1);
    }
  }

  const updateLetter = (index, letter) => {
    word[index] = letter;
    setWord(word);
    setActiveBox(activeBox + 1);
  };

  return (
    <>
      <div
        id={"row_" + id}
        className="rowContainer"
        onKeyDown={(e) => handleRowInput(e)}
      >
        <Box
          id={"box_" + id + "_" + 0}
          index={0}
          isDisabled={isDisabled}
          activeBox={activeBox}
          state={result[0].state}
          updateLetter={updateLetter}
        />
        <Box
          id={"box_" + id + "_" + 1}
          index={1}
          isDisabled={isDisabled}
          activeBox={activeBox}
          state={result[1].state}
          updateLetter={updateLetter}
        />
        <Box
          id={"box_" + id + "_" + 2}
          index={2}
          isDisabled={isDisabled}
          activeBox={activeBox}
          state={result[2].state}
          updateLetter={updateLetter}
        />
        <Box
          id={"box_" + id + "_" + 3}
          index={3}
          isDisabled={isDisabled}
          activeBox={activeBox}
          state={result[3].state}
          updateLetter={updateLetter}
        />
        <Box
          id={"box_" + id + "_" + 4}
          index={4}
          isDisabled={isDisabled}
          activeBox={activeBox}
          state={result[4].state}
          updateLetter={updateLetter}
        />
      </div>
    </>
  );
}

export default Row;
