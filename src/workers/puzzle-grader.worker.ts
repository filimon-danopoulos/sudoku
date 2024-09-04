import { Grader } from '../sudoku/grader/Grader';
import { Sudoku } from '../sudoku/model/Sudoku';

self.onmessage = (event: { data: string }) => {
  if (event.data.length === 81) {
    run(event.data);
  }
};

const run = (puzzle: string) => {
  const grader = new Grader();
  const sudoku = new Sudoku(puzzle);
  const { grade } = grader.grade(sudoku);
  self.postMessage({
    puzzle: sudoku.cells.map((x) => x.value || '0').join(''),
    grade,
  });
};
