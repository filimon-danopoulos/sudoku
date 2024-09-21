import '../elements/sudoku-context/sudoku-context.element';
import '../views/sudoku-game/sudoku-game.view';
import '../views/sudoku-solver/sudoku-solver.view';
import '../views/sudoku-settings/sudoku-settings.view';
import './index.css';

import { html, render } from 'lit';
import { keyed } from 'lit/directives/keyed.js';

import { registerRoutes } from './router';
import { difficulty, loadCurrentPuzzle, loadPuzzles, savePuzzles } from '../storage/puzzle-storage';
import { Rating } from '../sudoku/grader/Rating';
import { loadDifficulty, saveDifficulty } from '../storage/difficulty-storage';

const puzzles = loadPuzzles();

const routes = {
  '/new/:difficulty': (difficulty: difficulty) => {
    const puzzle = puzzles[difficulty].pop();
    saveDifficulty(difficulty);
    if (puzzle) {
      savePuzzles(puzzles);
      window.location.hash = `#/sudoku/${puzzle}`;
    }
    return 'redirect';
  },
  '/new': () => {
    window.location.hash = `#/new/${loadDifficulty()}`;
    return 'redirect';
  },
  '/sudoku/:puzle': (puzzle: string) => {
    return keyed(puzzle, html`<sudoku-game-view sudoku=${puzzle}></sudoku-game-view>`);
  },
  '/sudoku': () => {
    const { puzzle, difficulty } = loadCurrentPuzzle();
    if (puzzle) {
      saveDifficulty(difficulty);
      window.location.hash = `#/sudoku/${puzzle}`;
    } else {
      window.location.hash = `#/new/${loadDifficulty()}`;
    }
    return 'redirect';
  },
  '/solver/:puzle': (puzzle: string) => {
    return html`<sudoku-solver-view sudoku=${puzzle}></sudoku-solver-view>`;
  },
  '/solver': () => {
    const { puzzle } = loadCurrentPuzzle();
    if (puzzle) {
      window.location.hash = `#/solver/${puzzle}`;
      return 'redirect';
    }
    return html`<sudoku-solver-view></sudoku-solver-view>`;
  },
  '/settings': () => {
    return html`<sudoku-settings-view></sudoku-settings-view>`;
  },
  '/': '/sudoku',
  '': '/sudoku',
} as Record<string, string | ((...params: unknown[]) => unknown)>;

const busyGeneratorWorkers = [] as Worker[];
const freeGeneratorWorkers = Array.from(
  { length: 2 },
  () => new Worker(new URL('../workers/puzzle-generator.worker', import.meta.url))
);
const graderWorker = new Worker(new URL('../workers/puzzle-grader.worker', import.meta.url));

const update = (view: unknown) =>
  render(
    html` <sudoku-context .difficulty=${loadDifficulty()}>${view}</sudoku-context> `,
    document.body
  );

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

const generateMoreThreshold = 100;
graderWorker.onmessage = ({ data }: MessageEvent<{ grade: Rating; puzzle: string }>) => {
  const ratingMap = {
    [Rating.Easy]: 'easy',
    [Rating.Moderate]: 'moderate',
    [Rating.Hard]: 'hard',
    [Rating.Extreme]: 'extreme',
  } as Record<Rating, difficulty>;
  if (data.grade in ratingMap) {
    const difficulty = ratingMap[data.grade];
    if (puzzles[difficulty].length < generateMoreThreshold) {
      puzzles[difficulty].push(data.puzzle);
      savePuzzles(puzzles);
    }
  }
  requestNewPuzzle();
};

function requestNewPuzzle(): void {
  if (
    puzzles.easy.length < generateMoreThreshold ||
    puzzles.moderate.length < generateMoreThreshold ||
    puzzles.hard.length < generateMoreThreshold ||
    puzzles.extreme.length < generateMoreThreshold
  ) {
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
