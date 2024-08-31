import '../views/sudoku-game.element';

import '@fontsource/roboto';
import { getPuzzle } from '../puzzles/puzzle-service';
import type { SudokuGameViewElement } from '../views/sudoku-game.element';

export const main = () => {
  const $app = document.createElement('sudoku-game-view') as SudokuGameViewElement;
  document.body.appendChild($app);

  const puzzle = getPuzzle();
  $app.puzzle = puzzle;
};
