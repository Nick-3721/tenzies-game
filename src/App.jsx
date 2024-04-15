import { useState, useEffect } from "react";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [currentScore, setCurrentScore] = useState(1)
  const [highscore, setHighscore] = useState(null)

  useEffect(() => {
    let chosenNumber = dice[0].value

    const checkHeld = dice.every((die) => die.isHeld === true)
    const checkNumber = dice.every((die) => die.value === chosenNumber)

    setTenzies(checkHeld && checkNumber ? true : false);
  }, [dice], [tenzies])
  
  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6 + 1),
      isHeld: false,
      id: nanoid()}
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice () {
    setDice(oldDice => oldDice.map(die => {
      return die.isHeld ? 
        {...die}
        : generateNewDie()
    }))
    setCurrentScore(currentScore +1)
  }

  function newGame () {
    setTenzies(false)
    setDice(allNewDice())
    setCurrentScore(1)
  }

  function holdDice(id){
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
        {...die, isHeld: !die.isHeld} 
        : die    
    }))
  }

  // infinity in use state appraoch
  // if (tenzies && currentScore < highscore){
  //     setHighscore(currentScore);
  //   }
  
  // if (tenzies) {
  //   if(highscore === undefined) {setHighscore(currentScore);}
  //   else if(currentScore < highscore){
  //     setHighscore(currentScore);
  //   }
  // }

  if (tenzies && (highscore ?? Infinity) > currentScore) {
    setHighscore(currentScore);
  }
  
  console.log(`currentScore ${currentScore}`)
  console.log(`highscore ${highscore}`)

  return (
    <>
      <main>
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {dice.map((die) => (
            < Die
                value={die.value} 
                key={die.id} 
                holdDice={() => holdDice(die.id)}
                isHeld={die.isHeld}
            />
            // <Die value={die.value} key={die.id} id={die.id} isHeld={die.isHeld} holdDice={holdDice}></Die>
          ))}
        </div>
        <div className="btn-wrapper">
          {tenzies?
            <button className="reset-btn" onClick={newGame}>New Game</button>
          : <button onClick={rollDice}>Roll</button>
        }
        </div>
        <p>Your Score is: {currentScore}</p>
        {highscore && <p>Your best score is:{highscore}</p>}
      </main>
    </>
  );
}
