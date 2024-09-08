import '../components/sudoku-context/sudoku-context.element';
import '../views/sudoku-game/sudoku-game.view';
import '../views/sudoku-solver/sudoku-solver.view';
import './index.css';

import { html, render } from 'lit';
import { registerRoutes } from './router';
import { difficulty, loadPuzzles, savePuzzles } from '../storage/puzzle-storage';
import { Rating } from '../sudoku/grader/Rating';
import { ChangeDifficultyEvent } from '../components/sudoku-context/ChangeDifficultyEvent';
import { loadDifficulty, saveDifficulty } from '../storage/difficulty-storage';

const puzzles = loadPuzzles();

const routes = {
  '': '/sudoku/new/moderate',
  '/': '/sudoku/new/moderate',
  '/sudoku': () => {
    const puzzle = Object.keys(JSON.parse(localStorage.getItem('ongoing') ?? '{}')).at(0) ?? '';
    if (puzzle) {
      window.location.hash = `#/sudoku/${puzzle}`;
    } else {
      window.location.hash = `#/sudoku/new`;
    }
    return 'redirect';
  },
  '/sudoku/new': () => {
    const difficulty = loadDifficulty();
    const puzzle = puzzles[difficulty].pop();
    if (puzzle) {
      savePuzzles(puzzles);
      window.location.hash = `#/sudoku/${puzzle}`;
    }
    return 'redirect';
  },
  '/sudoku/new/:difficulty': (difficulty: difficulty) => {
    const puzzle = puzzles[difficulty].pop();
    saveDifficulty(difficulty);
    if (puzzle) {
      savePuzzles(puzzles);
      window.location.hash = `#/sudoku/${puzzle}`;
    }
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

const update = (view: unknown) =>
  render(
    html`
      <sudoku-context
        .difficulty=${loadDifficulty()}
        @change-difficulty=${((e: ChangeDifficultyEvent) => saveDifficulty(e.difficulty)) as EventListener}
        >${view}</sudoku-context
      >
    `,
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
