import React, { Component } from "react";
import BoardRow from "./boardRow";
import EndGame from "./endGame";

class Board extends Component {
  renderBoardRows = () => {
    const {
      board,
      color,
      digitColor,
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
          digitColor={digitColor[i]}
          handleSelectCell={handleSelectCell}
          handleMouseEnterCell={handleMouseEnterCell}
          handleMouseLeaveCell={handleMouseLeaveCell}
        />
      );
    }
    return rows;
  };

  renderGame = () => {
    return (
      <table className="game-table">
        <tbody>{this.renderBoardRows()}</tbody>
      </table>
    );
  };

  renderEndGame = (reason, remainingCells, timeExpired) => {
    return (
      <EndGame
        reason={reason}
        remainingCells={remainingCells}
        timeExpired={timeExpired}
      />
    );
  };

  render() {
    const { ended, reason, remainingCells, timeExpired } = this.props;
    return (
      <div className="game-container">
        <div id="game" className="game">
          {ended
            ? this.renderEndGame(reason, remainingCells, timeExpired)
            : this.renderGame()}
        </div>
      </div>
    );
  }
}

export default Board;
