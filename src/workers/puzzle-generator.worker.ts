import { Generator } from '../sudoku/generator/Generator';
import { queueTask } from '../utils/task';

let running = false;
self.onmessage = (event: { data: 'start' | 'stop' }) => {
  if (event.data === 'start') {
    running = true;
    run();
  } else if (event.data === 'stop') {
    running = false;
  }
};

const run = () => {
  if (running) {
    const generator = new Generator();
    if (generator.generate()) {
      const { puzzle, solution } = generator.getPuzzleData();
      self.postMessage({
        puzzle,
        solution,
      });
    }
    queueTask(run);
  }
};
