import '../components/sudoku-board/sudoku-board.element';
import '@fontsource/roboto';

export const main = () => {
  const $board = document.createElement('sudoku-board');
  document.body.appendChild($board);
};
