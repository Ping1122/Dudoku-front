import React, { Component } from "react";
import { toast } from "react-toastify";
import sudoku from "../service/sudoku";
import Board from "./board";
import Numpad from "./numpad";
import PlayerCard from "./playerCard";
import Timer from "./timer";

class Game extends Component {
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
      ended: false,
      reason: "",
      remainingCells: 81
    };
    this.endGameTimeoutTicket = null;
  }

  getSudokuAndSolution = async () => {
    const level = window.location.pathname.substring(6);
    const state = await sudoku.getSudokuAndSolution(level);
    const { board, solution } = state;
    state.color = this.setIncorrectColor(board, solution, this.state.color);
    this.setState(state);
    return state.timeExpired;
  };

  handleEndGame = async () => {
    console.log("endgame timeout");
    try {
      await sudoku.endGame("timeout");
      this.setState({
        ended: true,
        reason: "timeout"
      });
    } catch (ex) {
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
    console.log(this.state);
  };

  endGameAfterTimeout = timeExpired => {
    this.endGameTimeoutTicket = setTimeout(
      this.handleEndGame,
      20 * 60 * 1000 - timeExpired
    );
  };

  async componentDidMount() {
    const timeExpired = await this.getSudokuAndSolution();
    this.endGameAfterTimeout(timeExpired);
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

  handleTooManyMistakes = async () => {
    console.log("endgame mistakes");
    try {
      await sudoku.endGame("mistake");
      this.setState({
        ended: true,
        reason: "mistake"
      });
    } catch (ex) {
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
    clearTimeout(this.endGameTimeoutTicket);
    console.log(this.state);
  };

  handleCompleted = async () => {
    console.log("endgame completed");
    try {
      await sudoku.endGame("complete");
      this.setState({
        ended: true,
        reason: "complete"
      });
    } catch (ex) {
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
    clearTimeout(this.endGameTimeoutTicket);
    console.log(this.state);
  };

  handleFillCell = async num => {
    const { origin, board, selectedCell } = this.state;
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
          this.handleTooManyMistakes();
        }
      }
      board[x][y] = num;
      this.setState({
        board
      });
      if (remainingCells == 0) {
        this.handleCompleted();
      }
      this.setColor(selectedCell);
    } catch (ex) {
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
  };

  handleDeleteCell = async () => {
    const { origin, board, selectedCell } = this.state;
    if (!selectedCell) return;
    const [x, y] = selectedCell;
    if (origin[x][y] === 1) return;
    try {
      const result = await sudoku.deleteCell(selectedCell);
      board[x][y] = 0;
      this.setState({
        board
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
    console.log("endgame giveup");
    try {
      await sudoku.endGame("giveup");
      this.setState({
        ended: true,
        reason: "giveup"
      });
    } catch (ex) {
      const error = ex.response && ex.response.data.message;
      toast.info(error);
    }
    clearTimeout(this.endGameTimeoutTicket);
    console.log(this.state);
  };

  render() {
    const { board, color, mistakes, timeExpired } = this.state;
    return (
      <div className="game-form">
        {timeExpired === -1 ? null : <Timer startTime={timeExpired} />}
        <div className="row text-center p-0">
          <div className="col-md-3 text-center p-0">
            <PlayerCard mistakes={mistakes} />
            <Numpad
              handleFillCell={this.handleFillCell}
              handleDeleteCell={this.handleDeleteCell}
              handleGiveUp={this.handleGiveUp}
            />
          </div>
          <div className="col-md-6 p-0">
            <Board
              board={board}
              color={color}
              handleSelectCell={this.handleSelectCell}
              handleMouseEnterCell={this.handleMouseEnterCell}
              handleMouseLeaveCell={this.handleMouseLeaveCell}
            />
          </div>
          <div className="col-md-3 p-0">
            <PlayerCard />
            <Numpad
              handleFillCell={this.handleFillCell}
              handleDeleteCell={this.handleDeleteCell}
              handleGiveUp={this.handleGiveUp}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
