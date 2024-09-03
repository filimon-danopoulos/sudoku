import '../views/sudoku-game/sudoku-game.view';
import '../views/sudoku-solver/sudoku-solver.view';

import '@fontsource/roboto';
import { html, render } from 'lit';
import { registerRoutes } from './router';
import { countUnsolvedPuzzles, saveUnsolvedPuzzle } from '../storage/puzzle-storage';

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

const generatorWorker = new Worker(new URL('../workers/puzzle-generator.worker', import.meta.url));

let running = false;
export const main = () => {
  if (running) {
    return;
  }
  running = true;
  const update = (view: unknown) => render(view, document.body);
  registerRoutes(routes, update);

  generatorWorker.onmessage = ({ data }: MessageEvent<{ puzzle: string; solution: string }>) => {
    saveUnsolvedPuzzle(data.puzzle, data.solution);
    if (countUnsolvedPuzzles() > 100) {
      generatorWorker.postMessage('stop');
    }
  };
  generatorWorker.postMessage('start');
};
