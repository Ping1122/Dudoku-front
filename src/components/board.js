import React, { Component } from "react";
import BoardRow from "./boardRow";

class Board extends Component {
  renderBoardRows = () => {
    const {
      board,
      color,
      handleSelectCell,
      handleMouseEnterCell,
      handleMouseLeaveCell
    } = this.props;
    let rows = [];
    for (let i = 0; i < board.length; i++) {
      rows.push(
        <BoardRow
          key={i}
          pos={i}
          row={board[i]}
          color={color[i]}
          handleSelectCell={handleSelectCell}
          handleMouseEnterCell={handleMouseEnterCell}
          handleMouseLeaveCell={handleMouseLeaveCell}
        />
      );
    }
    return rows;
  };

  render() {
    return (
      <div className="game-container">
        <div id="game" className="game">
          <table className="game-table">
            <tbody>{this.renderBoardRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Board;
