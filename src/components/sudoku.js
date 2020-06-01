import React, { Component } from "react";
import { toast } from "react-toastify";
import sudoku from "../service/sudoku";
import emitter from "../service/emitter";
import Board from "./board";
import Numpad from "./numpad";
import PlayerCard from "./playerCard";
import Timer from "./timer";

class Sudoku extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      solution: [],
      origin: [],
      timeExpired: -1,
      selectCell: [],
      mistakes: 0,
      color: [
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
      ],
      digitColor: [
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
      ],
      ended: false,
      reason: "",
      remainingCells: 81
    };
    this.endGameTimeoutTicket = null;
    this.keyToNumMap = {
      q: 1,
      w: 2,
      e: 3,
      a: 4,
      s: 5,
      d: 6,
      z: 7,
      x: 8,
      c: 9
    };
  }

  getSudokuAndSolution = async () => {
    const level = window.location.pathname.substring(8);
    const state = await sudoku.getSudokuAndSolution(level);
    const { board, solution, origin } = state;
    state.color = this.setIncorrectColor(board, solution, this.state.color);
    state.digitColor = this.setDigitColor(origin, this.state.digitColor);
    this.setState(state);
    return state.timeExpired;
  };

  setDigitColor = (origin, digitColor) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (origin[i][j] === 2) {
          digitColor[i][j] = "player1";
        }
      }
    }
    return digitColor;
  };

  handleEndGame = async reason => {
    console.log(`endgame ${reason}`);
    try {
      const { timeExpired } = await sudoku.endGame(reason);
      console.log(timeExpired);
      this.setState({
        ended: true,
        reason,
        timeExpired
      });
    } catch (ex) {
      console.log(ex);
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
    emitter.emit("Game Ended", { reason });
    console.log(this.state);
  };

  endGameAfterTimeout = timeExpired => {
    this.endGameTimeoutTicket = setTimeout(
      () => this.handleEndGame("timeout"),
      20 * 60 * 1000 - timeExpired
    );
  };

  handleKeyDown = event => {
    console.log(event);
    if (event.keyCode >= 49 && event.keyCode <= 57) {
      this.handleFillCell(event.keyCode - 48);
      return;
    }
    const num = this.keyToNumMap[event.key];
    if (num) {
      this.handleFillCell(num);
    }
  };

  async componentDidMount() {
    const timeExpired = await this.getSudokuAndSolution();
    this.endGameAfterTimeout(timeExpired);
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  handleSelectCell = cell => {
    this.setState({ selectedCell: cell });
    this.setColor(cell);
  };

  handleMouseEnterCell = cell => {
    const { color } = this.state;
    const [x, y] = cell;
    if (color[x][y] !== "") return;
    color[x][y] = "hover";
    this.setState({
      color
    });
  };

  handleMouseLeaveCell = cell => {
    const { color } = this.state;
    const [x, y] = cell;
    if (color[x][y] !== "hover") return;
    color[x][y] = "";
    this.setState({
      color
    });
  };

  handleFillCell = async num => {
    const { ended, origin, board, selectedCell, digitColor } = this.state;
    if (ended || !selectedCell || !board) return;
    const [x, y] = selectedCell;
    if (origin[x][y] === 1) return;
    try {
      const { result, mistakes, remainingCells } = await sudoku.fillCell(
        selectedCell,
        num
      );
      if (result === "incorrect") {
        this.setState({
          mistakes
        });
        if (mistakes >= 3) {
          this.handleEndGame("mistake");
        }
      }
      digitColor[x][y] = "player1";
      board[x][y] = num;
      this.setState({
        board,
        digitColor
      });
      if (remainingCells == 0) {
        this.handleEndGame("complete");
      }
      this.setColor(selectedCell);
    } catch (ex) {
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
  };

  handleDeleteCell = async () => {
    const { origin, board, selectedCell, digitColor } = this.state;
    if (!selectedCell) return;
    const [x, y] = selectedCell;
    if (origin[x][y] === 1) return;
    try {
      const result = await sudoku.deleteCell(selectedCell);
      board[x][y] = 0;
      digitColor[x][y] = "";
      this.setState({
        board,
        digitColor
      });
    } catch (ex) {
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
  };

  setConflictColor = (x, y, color) => {
    for (let i = 0; i < 9; i++) {
      color[x][i] = "conflict";
      color[i][y] = "conflict";
    }
    const boxX = Math.floor(x / 3) * 3;
    const boxY = Math.floor(y / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        color[boxX + i][boxY + j] = "conflict";
      }
    }
    return color;
  };

  setSameColor = (cellValue, board, color) => {
    if (cellValue) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (cellValue === board[i][j]) {
            color[i][j] = "same";
          }
        }
      }
    }
    return color;
  };

  setSelectedColor = (x, y, cellValue, solutionValue, color) => {
    color[x][y] = "selected";
    if (cellValue !== 0 && cellValue !== solutionValue) {
      color[x][y] = "incorrect";
    }
    return color;
  };

  setIncorrectColor = (board, solution, color) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0 && board[i][j] !== solution[i][j]) {
          color[i][j] = "incorrect";
        }
      }
    }
    return color;
  };

  setColor = cell => {
    const [x, y] = cell;
    const { board, solution } = this.state;
    let color = [
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""]
    ];
    color = this.setConflictColor(x, y, color);
    color = this.setSameColor(board[x][y], board, color);
    color = this.setIncorrectColor(board, solution, color);
    color = this.setSelectedColor(x, y, board[x][y], solution[x][y], color);
    this.setState({
      color
    });
  };

  handleGiveUp = async () => {
    await this.handleEndGame("giveup");
  };

  render() {
    const {
      board,
      color,
      digitColor,
      mistakes,
      ended,
      reason,
      timeExpired,
      remainingCells
    } = this.state;
    return (
      <div className="game-form">
        {timeExpired === -1 ? null : (
          <Timer startTime={timeExpired} ended={ended} />
        )}
        <div className="row text-center p-0">
          <div className="col-md-4 text-center p-0">
            <PlayerCard mistakes={mistakes} />
            <Numpad
              ended={ended}
              handleFillCell={this.handleFillCell}
              handleDeleteCell={this.handleDeleteCell}
              handleGiveUp={this.handleGiveUp}
            />
          </div>
          <div className="col-md-6 p-0">
            <Board
              ended={ended}
              reason={reason}
              remainingCells={remainingCells}
              timeExpired={timeExpired}
              board={board}
              color={color}
              digitColor={digitColor}
              handleSelectCell={this.handleSelectCell}
              handleMouseEnterCell={this.handleMouseEnterCell}
              handleMouseLeaveCell={this.handleMouseLeaveCell}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Sudoku;
