import '../components/sudoku-shell/sudoku-shell.element';
import '@fontsource/roboto';
import { getPuzzle } from '../puzzles/puzzle-service';
import type { SudokuShellElement } from '../components/sudoku-shell/sudoku-shell.element';

export const main = () => {
  const $app = document.createElement('sudoku-shell') as SudokuShellElement;
  document.body.appendChild($app);

  const puzzle = getPuzzle();
  $app.puzzle = puzzle;
};
