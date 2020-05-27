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

const NumpadNum = props => {
  const { number, handleFillCell } = props;
  let value;
  switch (number) {
    case 1:
      value = <One />;
      break;
    case 2:
      value = <Two />;
      break;
    case 3:
      value = <Three />;
      break;
    case 4:
      value = <Four />;
      break;
    case 5:
      value = <Five />;
      break;
    case 6:
      value = <Six />;
      break;
    case 7:
      value = <Seven />;
      break;
    case 8:
      value = <Eight />;
      break;
    case 9:
      value = <Nine />;
      break;
    default:
      value = null;
  }
  return (
    <div className="numpad-item" onClick={() => handleFillCell(number)}>
      {value}
    </div>
  );
};

export default NumpadNum;
