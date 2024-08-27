import '../components/sudoku-shell/sudoku-shell.element';
import '@fontsource/roboto';

export const main = () => {
  const $app = document.createElement('sudoku-shell');
  document.body.appendChild($app);
};
