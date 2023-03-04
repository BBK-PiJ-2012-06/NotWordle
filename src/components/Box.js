import { useContext, useEffect, useState, useRef } from "react";
import { act } from "react-dom/test-utils";

import "./Box.css";
import { GameContext } from "./BWordle";

export default function Box({
  id,
  index,
  isDisabled,
  activeBox,
  state,
  updateLetter,
}) {
  const { game, setGame } = useContext(GameContext);
  const [letter, setLetter] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (activeBox === index) {
      inputRef.current.focus();
    }
  }, [activeBox, index, id]);

  const handleChange = (e) => {
    var newLetter = e.target.value.toUpperCase();
    setLetter(newLetter);
    updateLetter(index, newLetter);
  };

  return (
    <>
      <input
        ref={inputRef}
        onChange={handleChange}
        className={"letterBox " + state}
        id={id}
        maxLength={1}
        disabled={isDisabled}
      />
    </>
  );
}
