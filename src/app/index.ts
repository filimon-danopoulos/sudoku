import '../views/sudoku-game/sudoku-game.view';
import '../views/sudoku-solver/sudoku-solver.view';
import './index.css';

import { html, render } from 'lit';
import { registerRoutes } from './router';
import { difficulty, loadPuzzles, savePuzzles } from '../storage/puzzle-storage';
import { Rating } from '../sudoku/grader/Rating';

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

const busyGeneratorWorkers = [] as Worker[];
const freeGeneratorWorkers = Array.from(
  { length: 2 },
  () => new Worker(new URL('../workers/puzzle-generator.worker', import.meta.url))
);
const graderWorker = new Worker(new URL('../workers/puzzle-grader.worker', import.meta.url));

const update = (view: unknown) => render(view, document.body);
registerRoutes(routes, update);
for (const worker of freeGeneratorWorkers) {
  worker.onmessage = ({ data }: MessageEvent<{ puzzle: string } | 'failed'>) => {
    const buzyIndex = busyGeneratorWorkers.indexOf(worker);
    busyGeneratorWorkers.splice(buzyIndex, 1);
    freeGeneratorWorkers.push(worker);
    if (data === 'failed') {
      worker.postMessage('generate');
    } else {
      graderWorker.postMessage(data.puzzle);
    }
  };
}

const puzzles = loadPuzzles();
graderWorker.onmessage = ({ data }: MessageEvent<{ grade: Rating; puzzle: string }>) => {
  const ratingMap = {
    [Rating.Easy]: 'easy',
    [Rating.Moderate]: 'moderate',
    [Rating.Hard]: 'hard',
    [Rating.Extreme]: 'extreme',
  } as Record<Rating, difficulty>;
  if (data.grade in ratingMap) {
    const difficulty = ratingMap[data.grade];
    if (puzzles[difficulty].length < 20) {
      puzzles[difficulty].push(data.puzzle);
      savePuzzles(puzzles);
    }
  }
  requestNewPuzzle();
};

function requestNewPuzzle(): void {
  if (puzzles.easy.length < 20 || puzzles.moderate.length < 20 || puzzles.hard.length < 20 || puzzles.extreme.length) {
    if (freeGeneratorWorkers.length) {
      const worker = freeGeneratorWorkers.pop() as Worker;
      busyGeneratorWorkers.push(worker);
      worker?.postMessage('generate');
    } else {
      setTimeout(requestNewPuzzle, 250);
    }
  }
}

requestNewPuzzle();
