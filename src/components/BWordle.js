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

const theWord = "SPELL"; //TODO pick word from a list
const letterCounts = {
  //should construct this really...
  L: 2,
  E: 1,
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
      let guessLetter = guess[index];

      if (!guessLetter || guessLetter.trim() === "") {
        return null;
      }

      let numberInWord = letterCounts[guessLetter] ?? 0;
      let correctCountForLetter = correctLetterCounts[guessLetter] ?? 0;
      let presentCountForLetter = presentLetterCounts[guessLetter] ?? 0;

      if (guessLetter === theWord[index]) {
        handleCorrectGuess(
          index,
          guessLetter,
          correctCountForLetter,
          numberInWord
        );
      } else if (theWord.includes(guessLetter)) {
        handlePresentGuess(
          numberInWord,
          correctCountForLetter,
          presentCountForLetter,
          guessLetter,
          index
        );
      } else {
        //incorrect letter
        result[index] = { letter: guessLetter, state: "incorrect" };
      }
    }
    if (correctLettersTotal === 5) {
      setWin(true);
      setLose(false);
      return result;
    }
    incrementActiveRow();
    return result;

    function handlePresentGuess(
      numberInWord,
      correctCountForLetter,
      presentCountForLetter,
      guessLetter,
      index
    ) {
      //if there are remaining instances of this letter in the word: present; otherwise incorrect
      if (numberInWord - correctCountForLetter - presentCountForLetter > 0) {
        presentLetterCounts[guessLetter] = presentCountForLetter + 1;
        result[index] = { letter: guessLetter, state: "present" };
      } else {
        result[index] = { letter: guessLetter, state: "incorrect" };
      }
    }

    function handleCorrectGuess(
      index,
      guessLetter,
      correctCountForLetter,
      numberInWord
    ) {
      //correct letter
      result[index] = { letter: guessLetter, state: "correct" };
      correctLetterCounts[guessLetter] = correctCountForLetter + 1;
      correctLettersTotal++;

      let remainingOfThisLetter =
        correctLetterCounts[guessLetter] - numberInWord;

      //update previous letter results in case a letter marked present has now been found
      //if there are no remaining unfound instances of this letter, prior "present" results should be "incorrect"
      for (let i = 0; i < index; i++) {
        if (result[i].letter === guessLetter && result[i].state === "present") {
          if (remainingOfThisLetter <= 0) {
            result[i].state = "incorrect";
          }
          remainingOfThisLetter--;
        }
      }
    }
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
