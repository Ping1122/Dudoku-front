import React from "react";
import User from "../service/user";
import Clock from "../timer.png";

const EndDudoku = props => {
  const { reason, winner, remainingCells, timeExpired } = props;
  console.log("winner");
  console.log(winner);
  const currentUser = User.getCurrentUser();
  const winningMessage = "You win!";
  const losingMessage = "You lost!";
  const time = Math.floor(timeExpired / 1000);
  const sec = time % 60;
  const min = Math.floor(time / 60);
  const minute = min.toString().padStart(2, "0");
  const second = sec.toString().padStart(2, "0");
  const winningReasonMessage = {
    timeout: "You filled more cells, well done",
    mistake: "Your opponent made too many mistakes",
    complete: "You filled more cells, well done",
    giveup: "Your opponent gaved up"
  };
  const losingReasonMessage = {
    timeout: "Your opponent filled more cells",
    mistake: "You made too many mistakes",
    complete: "Your opponent filled more cells",
    giveup: "A winner should never quit"
  };

  return (
    <div className="end-game">
      <br />
      <br />
      <br />
      <h2>{winner === currentUser.email ? winningMessage : losingMessage}</h2>
      <p>
        {winner === currentUser.email
          ? winningReasonMessage[reason]
          : losingReasonMessage[reason]}
      </p>
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

export default EndDudoku;
