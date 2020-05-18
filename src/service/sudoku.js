import http from "./http";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/api/sudoku";

async function getSudokuAndSolution(level) {
  const { data } = await http.get(`${apiEndpoint}/${level}`);
  const sudoku = {
    board: boardStringToList(data.board),
    solution: boardStringToList(data.solution)
  };
  return sudoku;
}

function boardStringToList(boardString) {
  if (boardString.length !== 81) return null;
  let boardList = [];
  for (let i = 0; i < 9; i++) {
    let temp = [];
    for (let j = 0; j < 9; j++) {
      temp.push(parseInt(boardString.charAt(i * 9 + j)));
    }
    boardList.push(temp);
  }
  return boardList;
}

export default {
  getSudokuAndSolution
};
