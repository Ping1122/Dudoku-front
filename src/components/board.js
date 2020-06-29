import React, { Component } from "react";
import BoardRow from "./boardRow";
import EndSudoku from "./endSudoku";
import EndDudoku from "./endDudoku";

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

  renderEndGame = (mode, reason, winner, remainingCells, timeExpired) => {
    if (mode === "sudoku") {
      return (
        <EndSudoku
          reason={reason}
          remainingCells={remainingCells}
          timeExpired={timeExpired}
        />
      );
    }
    if (mode === "dudoku") {
      return (
        <EndDudoku
          reason={reason}
          winner={winner}
          remainingCells={remainingCells}
          timeExpired={timeExpired}
        />
      );
    }
  };

  render() {
    const {
      mode,
      ended,
      reason,
      winner,
      remainingCells,
      timeExpired
    } = this.props;
    return (
      <div className="game-container">
        <div id="game" className="game">
          {ended
            ? this.renderEndGame(
                mode,
                reason,
                winner,
                remainingCells,
                timeExpired
              )
            : this.renderGame()}
        </div>
      </div>
    );
  }
}

export default Board;
