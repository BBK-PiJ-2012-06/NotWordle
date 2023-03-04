import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";

import Row from "./Row";

// const theWord = "LEAST"; //TODO pick word from a list
// const letterCounts = {
//   L: 1,
//   E: 1,
//   A: 1,
//   S: 1,
//   T: 1,
// };

const theWord = "LOOPS"; //TODO pick word from a list
const letterCounts = {
  L: 1,
  O: 2,
  P: 1,
  S: 1,
};
export const GameContext = createContext(null);

function BWordle() {
  const [activeRow, setActiveRow] = useState(1);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [gameContext, setGameContext] = useState({
    guess: 1,
    theWord: theWord,
    win: false,
  }); //kinda wish this worked... :<

  const incrementActiveRow = useCallback(() => {
    if (activeRow > 6) return;
    if (activeRow === 6 && !win) {
      setLose(true);
      setWin(false);
    }
    var newActiveRow = activeRow + 1;
    setActiveRow(newActiveRow);
    // console.log("active row = " + newActiveRow);
  }, [activeRow, win]);

  useEffect(() => {
    if (win) {
      setActiveRow(-1);
    }
  }, [incrementActiveRow, win]);

  const submitGuess = (guess) => {
    if (guess.length !== 5) return null;

    let result = [];
    let correctLettersTotal = 0;
    let correctLetterCounts = {};
    let presentLetterCounts = {};
    for (let index = 0; index < guess.length; index++) {
      let letter = guess[index];

      if (!letter || letter.trim() === "") {
        return null;
      }

      let numberInWord = letterCounts[letter] ?? 0;
      console.log("number of " + letter + "s in word: " + numberInWord);

      if (letter === theWord[index]) {
        result[index] = { letter: letter, state: "correct" };
        let correctCountForLetter = correctLetterCounts[letter] ?? 0;
        correctLetterCounts[letter] = correctCountForLetter + 1;
        correctLettersTotal++;

        let remainingOfThisLetter = correctLetterCounts[letter] - numberInWord;
        for (let i = 0; i < index; i++) {
          if (result[i].letter === letter && result[i].state === "present") {
            if (remainingOfThisLetter <= 0) {
              result[i].state = "incorrect";
            }
            remainingOfThisLetter--;
          }
        }
      } else if (theWord.includes(letter)) {
        let correctCountForLetter = correctLetterCounts[letter] ?? 0;
        let presentCountForLetter = presentLetterCounts[letter] ?? 0;

        if (numberInWord - correctCountForLetter - presentCountForLetter > 0) {
          presentLetterCounts[letter] = presentCountForLetter + 1;
          result[index] = { letter: letter, state: "present" };
        } else {
          result[index] = { letter: letter, state: "incorrect" };
        }
      } else {
        result[index] = { letter: letter, state: "incorrect" };
      }
    }
    if (correctLettersTotal === 5) {
      setWin(true);
      setLose(false);
      return result;
    }
    incrementActiveRow();
    return result;
  };

  return (
    <>
      <div id="BWordleContainer">
        BWordle <br />
        <GameContext.Provider value={{ gameContext, setGameContext }}>
          <Row id={1} activeRow={activeRow} submitGuess={submitGuess} />
          <Row id={2} activeRow={activeRow} submitGuess={submitGuess} />
          <Row id={3} activeRow={activeRow} submitGuess={submitGuess} />
          <Row id={4} activeRow={activeRow} submitGuess={submitGuess} />
          <Row id={5} activeRow={activeRow} submitGuess={submitGuess} />
          <Row id={6} activeRow={activeRow} submitGuess={submitGuess} />
        </GameContext.Provider>
      </div>
      {win ? <div>You win!</div> : <div></div>}
      {lose ? <div>You lose!</div> : <div></div>}
    </>
  );
}

export default BWordle;
