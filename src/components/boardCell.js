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

const BoardCell = props => {
  const {
    number,
    pos,
    color,
    handleSelectCell,
    handleMouseEnterCell,
    handleMouseLeaveCell
  } = props;
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
    <td
      className={`game-cell game-value ${color}`}
      onClick={() => handleSelectCell(pos)}
      onMouseEnter={() => handleMouseEnterCell(pos)}
      onMouseLeave={() => handleMouseLeaveCell(pos)}
    >
      <div className="cell-value">{value}</div>
    </td>
  );
};

export default BoardCell;
