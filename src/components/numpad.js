import React from "react";
import NumpadNum from "./numpadNum";
import Pencil from "../pencil.png";
import Eraser from "../eraser.png";
import Undo from "../undo.png";

const Numpad = props => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const { handleFillCell, handleDeleteCell, handleGiveUp } = props;
  return (
    <div className="numpad-wrapper">
      <div className="numpad">
        {numbers.map(number => {
          return (
            <NumpadNum
              key={number}
              number={number}
              handleFillCell={handleFillCell}
            />
          );
        })}

        <div className="numpad-item" onClick={handleDeleteCell}>
          <img className="numpad-icon" alt="eraser" src={Eraser} />
          <div className="game-controls-label">Erase</div>
        </div>
        <div className="numpad-item">
          <img className="numpad-icon" alt="undo" src={Undo} />
          <div className="game-controls-label">Undo</div>
        </div>
        <div className="numpad-item" onClick={handleGiveUp}>
          <img className="numpad-icon" alt="pencil" src={Pencil} />
          <div className="game-controls-label">Give up</div>
        </div>
      </div>
    </div>
  );
};

export default Numpad;
