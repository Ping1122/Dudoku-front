import React, { Component } from "react";
import { toast } from "react-toastify";
import dudoku from "../service/dudoku";
import user from "../service/user";
import emitter from "../service/emitter";
import topic from "../service/topic";
import WaitMatch from "./waitMatch";
import Board from "./board";
import Numpad from "./numpad";
import PlayerCard from "./playerCard";
import Timer from "./timer";

class Dudoku extends Component {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      id: 0,
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
      solution: [
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
      remainingCells: 81,
      currentUser: ""
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
    const state = await dudoku.getSudokuAndSolution(level);
    const { board, solution, origin, players } = state;
    state.color = this.setIncorrectColor(board, solution, this.state.color);
    state.created = true;
    state.digitColor = this.setDigitColor(
      players,
      origin,
      this.state.digitColor
    );
    this.setState(state);
    return state.timeExpired;
  };

  setDigitColor = (players, origin, digitColor) => {
    const { currentUser } = this.state;
    const { email } = currentUser;
    const currentUserOrigin = email === players[0].email ? 2 : 3;
    const opponentOrigin = email === players[0].email ? 3 : 2;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (origin[i][j] === currentUserOrigin) digitColor[i][j] = "player1";
        else if (origin[i][j] === opponentOrigin) digitColor[i][j] = "player2";
      }
    }
    return digitColor;
  };

  handleEndGame = async reason => {
    console.log(`endgame ${reason}`);
    try {
      const { timeExpired } = await dudoku.endGame(reason);
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
    if (num !== null) {
      this.handleFillCell(num);
    }
  };

  getCurrentUser = async () => {
    const currentUser = user.getCurrentUser();
    if (currentUser === null) return;
    this.setState({ currentUser });
  };

  highlightCell = (x, y) => {
    const { color } = this.state;
    const oldColor = color[x][y];
    color[x][y] = "highlight";
    this.setState({ color });
    setTimeout(() => {
      if (color[x][y] === "highlight") {
        color[x][y] = oldColor;
        this.setState({ color });
      }
    }, 200);
  };

  handleOpponentFill = message => {
    const { x, y, value, filled, mistakes, remainingCells } = JSON.parse(
      message.body
    );
    const {
      board,
      solution,
      color: myColor,
      digitColor,
      filled: myFilled,
      mistakes: myMistakes
    } = this.state;
    board[x][y] = value;
    digitColor[x][y] = "player2";
    myFilled[1] = filled;
    myMistakes[1] = mistakes;
    const color = this.setIncorrectColor(board, solution, myColor);
    this.setState({
      board,
      digitColor,
      color,
      filled: myFilled,
      mistakes: myMistakes,
      remainingCells
    });
    this.highlightCell(x, y);
  };

  handleOpponentDelete = message => {
    const { x, y, filled, remainingCells } = JSON.parse(message.body);
    const { board, digitColor, filled: myFilled } = this.state;
    board[x][y] = 0;
    digitColor[x][y] = "";
    myFilled[1] = filled;
    this.setState({
      board,
      digitColor,
      filled: myFilled,
      remainingCells
    });
    this.highlightCell(x, y);
  };

  handleOpponentEnd = message => {
    const { reason, timeExpired, winner, remainingCells } = JSON.parse(
      message.body
    );
    this.setState({
      ended: true,
      reason,
      timeExpired,
      winner,
      remainingCells
    });
  };

  subscribeToOpponentActions = () => {
    const { id, players, currentUser } = this.state;
    const { email } = currentUser;
    const handlers = {
      handleFill: this.handleOpponentFill,
      handleDelete: this.handleOpponentDelete,
      handleEnd: this.handleOpponentEnd
    };
    const currentUserOrigin = email === players[0].email ? 2 : 3;
    topic.subscribe("/opponent-actions", id, currentUserOrigin, handlers);
  };

  async componentDidMount() {
    this.getCurrentUser();
    const timeExpired = await this.getSudokuAndSolution();
    this.subscribeToOpponentActions();
    this.endGameAfterTimeout(timeExpired);
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
    this.setState({ created: false });
    topic.disconnect();
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
    const {
      ended,
      origin,
      board,
      mistakes,
      filled,
      selectedCell,
      digitColor
    } = this.state;
    if (ended || !selectedCell || !board) return;
    const [x, y] = selectedCell;
    if (origin[x][y] === 1) return;
    try {
      const {
        result,
        mistakes: myMistake,
        remainingCells
      } = await dudoku.fillCell(selectedCell, num);
      if (result === "incorrect") {
        mistakes[0] = myMistake;
        this.setState({
          mistakes
        });
        if (mistakes[0] >= 3) {
          this.handleEndGame("mistake");
        }
      }
      if (result === "correct") {
        filled[0] += 1;
        this.setState({
          filled
        });
      }
      board[x][y] = num;
      digitColor[x][y] = "player1";
      this.setState({
        board,
        digitColor
      });
      if (remainingCells === 0) {
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
      await dudoku.deleteCell(selectedCell);
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
      created,
      board,
      color,
      digitColor,
      mistakes,
      filled,
      players: myPlayers,
      currentUser,
      winner,
      ended,
      reason,
      timeExpired,
      remainingCells
    } = this.state;
    let players = null;
    if (myPlayers) {
      players = myPlayers.slice(0);
    }
    if (players && players[0].email !== currentUser.email) {
      const temp = players[1];
      players[1] = players[0];
      players[0] = temp;
    }
    return !created ? (
      <div className="game-form">
        <WaitMatch />
      </div>
    ) : (
      <div className="game-form">
        {timeExpired === -1 ? null : (
          <Timer startTime={timeExpired} ended={ended} />
        )}
        <div className="row text-center p-0">
          <div className="col-md-3 text-center p-0">
            <PlayerCard
              id={0}
              mistakes={mistakes}
              filled={filled}
              players={players}
            />
            <Numpad
              ended={ended}
              handleFillCell={this.handleFillCell}
              handleDeleteCell={this.handleDeleteCell}
              handleGiveUp={this.handleGiveUp}
            />
          </div>
          <div className="col-md-6 p-0">
            <Board
              mode="dudoku"
              ended={ended}
              winner={winner}
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
          <div className="col-md-3 p-0">
            <PlayerCard
              id={1}
              mistakes={mistakes}
              filled={filled}
              players={players}
            />
            <Numpad
              ended={ended}
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

export default Dudoku;
