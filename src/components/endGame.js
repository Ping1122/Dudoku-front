import React from "react";
import Clock from "../timer.png";

const EndGame = props => {
  const { reason, remainingCells, timeExpired } = props;
  console.log(reason);
  const message = {
    timeout: "You ran out of time!",
    mistake: "You ran out of chances!",
    complete: "Excellent!",
    giveup: "A winner should never quit"
  };
  const time = Math.floor(timeExpired / 1000);
  const sec = time % 60;
  const min = Math.floor(time / 60);
  const minute = min.toString().padStart(2, "0");
  const second = sec.toString().padStart(2, "0");
  return (
    <div className="end-game">
      <br />
      <br />
      <br />
      <br />
      <h2>{message[reason]}</h2>
      <br />
      <p>
        <img className="timer" src={Clock} alt="timer" />
        <span className="time">
          &nbsp;&nbsp;{minute}&nbsp;:&nbsp;{second}
        </span>
      </p>
      <p>Remaining Cells&nbsp;:&nbsp;{remainingCells}</p>
      <button
        className="new-game-button"
        onClick={() => {
          window.location.reload();
        }}
      >
        New Game
      </button>
    </div>
  );
};

export default EndGame;
