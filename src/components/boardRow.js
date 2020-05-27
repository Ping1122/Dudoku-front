import React from "react";
import BoardCell from "./boardCell";

const BoardRow = props => {
  const {
    row,
    pos,
    color,
    handleSelectCell,
    handleMouseEnterCell,
    handleMouseLeaveCell
  } = props;
  return (
    <tr className="game-row">
      {row.map((number, index) => {
        return (
          <BoardCell
            key={index}
            pos={[pos, index]}
            number={number}
            color={color[index]}
            handleSelectCell={handleSelectCell}
            handleMouseEnterCell={handleMouseEnterCell}
            handleMouseLeaveCell={handleMouseLeaveCell}
          />
        );
      })}
    </tr>
  );
};

export default BoardRow;
