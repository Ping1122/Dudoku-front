import React, { Component } from "react";
import sudoku from "../service/sudoku";
import Board from "./board";
import Numpad from "./numpad";
import PlayerCard from "./playerCard";
import Timer from "./timer";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      solution: [],
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
      ]
    };
  }

  async componentDidMount() {
    const level = window.location.pathname.substring(6);
    const board = await sudoku.getSudokuAndSolution(level);
    board.min = 0;
    board.sec = 0;
    this.setState(board);
  }

  handleSelectCell = cell => {
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

  setColor = cell => {
    const [x, y] = cell;
    const { board } = this.state;
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
    for (let i = 0; i < 9; i++) {
      color[x][i] = "conflict";
      color[i][y] = "conflict";
    }
    const boxX = Math.floor(x / 3) * 3;
    const boxY = Math.floor(y / 3) * 3;
    console.log(boxX);
    console.log(boxY);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        color[boxX + i][boxY + j] = "conflict";
      }
    }
    if (board[x][y]) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[x][y] === board[i][j]) {
            color[i][j] = "same";
          }
        }
      }
    }
    color[x][y] = "selected";
    this.setState({
      color
    });
  };

  render() {
    const { board, color } = this.state;
    return (
      <div className="game-form">
        <Timer />
        <div className="row text-center p-0">
          <div className="col-md-3 text-center p-0">
            <PlayerCard />
            <Numpad />
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
            <Numpad />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
