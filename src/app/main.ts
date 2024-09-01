import '../views/sudoku-game/sudoku-game.element';
import '../views/sudoku-solver/sudoku-solver.element';

import '@fontsource/roboto';
import { getPuzzle } from '../puzzles/puzzle-service';
import { html, render } from 'lit';

export const main = () => {
  let view = 'game';
  const puzzle = '720096003000205000080004020000000060106503807040000000030800090000702000200430018';
  const solution = '725196483463285971981374526372948165196523847548617239634851792819762354257439618';

  const update = () =>
    render(
      view === 'game'
        ? html`<sudoku-game-view puzzle=${puzzle} solution=${solution}></sudoku-game-view>`
        : html`<sudoku-solver-view puzzle=${puzzle}></sudoku-solver-view>`,
      document.body
    );

  document.addEventListener('navigate', (e: Event) => {
    view = (e as CustomEvent<string>).detail;
    update();
  });

  update();
};
