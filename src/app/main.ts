import '../views/sudoku-game/sudoku-game.element';
import '../views/sudoku-solver/sudoku-solver.element';

import '@fontsource/roboto';
import { html, render } from 'lit';
import { registerRoutes } from './router';

const routes = {
  '': '/sudoku/new/normal',
  '/': '/sudoku/new/normal',
  '/sudoku': '/sudoku/new/normal',
  '/sudoku/new': '/sudoku/new/normal',
  '/sudoku/new/:difficulty': (difficulty: string) => {
    window.location.hash = '#/sudoku/720096003000205000080004020000000060106503807040000000030800090000702000200430018';
    return 'redirect';
  },
  '/sudoku/:puzle': (puzzle: string) => {
    return html`<sudoku-game-view sudoku=${puzzle}></sudoku-game-view>`;
  },
  '/solver': () => {
    return html`<sudoku-solver-view></sudoku-solver-view>`;
  },
  '/solver/:puzle': (puzzle: string) => {
    return html`<sudoku-solver-view sudoku=${puzzle}></sudoku-solver-view>`;
  },
} as Record<string, string | ((...params: unknown[]) => unknown)>;

let running = false;
export const main = () => {
  if (running) {
    return;
  }
  running = true;
  const update = (view: unknown) => render(view, document.body);
  registerRoutes(routes, update);
};
