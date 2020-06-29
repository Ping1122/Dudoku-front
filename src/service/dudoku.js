import http from "./http";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/api/dudoku";

async function getSudokuAndSolution(level) {
  const { data } = await http.get(`${apiEndpoint}/${level}`);
  console.log(data);
  const sudoku = {
    id: data.id,
    board: data.board,
    solution: data.solution,
    origin: data.origin,
    timeExpired: data.timeExpired,
    mistakes: data.mistakes,
    ended: data.ended,
    remainingCells: data.remainingCells,
    players: data.players,
    filled: data.filled
  };
  return sudoku;
}

async function fillCell(cell, value) {
  const [x, y] = cell;
  const { data } = await http.put(`${apiEndpoint}/cell`, {
    x,
    y,
    value
  });
  return data;
}

async function deleteCell(cell) {
  const [x, y] = cell;
  const { data } = await http.delete(`${apiEndpoint}/cell`, {
    data: {
      x,
      y,
      value: 1
    }
  });
  return data;
}

async function endGame(reason) {
  const { data } = await http.put(apiEndpoint, {
    reason
  });
  return data;
}

export default {
  getSudokuAndSolution,
  fillCell,
  deleteCell,
  endGame
};
