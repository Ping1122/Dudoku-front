import React from "react";
import One from "./numbers/one";
import Two from "./numbers/two";
import Three from "./numbers/three";
import Four from "./numbers/four";
import Five from "./numbers/five";
import Six from "./numbers/six";
import Seven from "./numbers/seven";
import Eight from "./numbers/eight";
import Nine from "./numbers/nine";
import Pencil from "../pencil.png";
import Eraser from "../eraser.png";
import Undo from "../undo.png";

const Numpad = () => {
  return (
    <div className="numpad-wrapper">
      <div className="numpad">
        <div className="numpad-item">
          <One />
        </div>
        <div className="numpad-item">
          <Two />
        </div>
        <div className="numpad-item">
          <Three />
        </div>
        <div className="numpad-item">
          <Four />
        </div>
        <div className="numpad-item">
          <Five />
        </div>
        <div className="numpad-item">
          <Six />
        </div>
        <div className="numpad-item">
          <Seven />
        </div>
        <div className="numpad-item">
          <Eight />
        </div>
        <div className="numpad-item">
          <Nine />
        </div>
        <div className="numpad-item">
          <img className="numpad-icon" alt="pencil" src={Pencil} />
          <div className="game-controls-label">Notes</div>
        </div>
        <div className="numpad-item">
          <img className="numpad-icon" alt="eraser" src={Eraser} />
          <div className="game-controls-label">Erase</div>
        </div>
        <div className="numpad-item">
          <img className="numpad-icon" alt="undo" src={Undo} />
          <div className="game-controls-label">Undo</div>
        </div>
      </div>
    </div>
  );
};

export default Numpad;
