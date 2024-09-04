import { Generator } from '../sudoku/generator/Generator';

self.onmessage = (event: { data: 'generate' }) => {
  if (event.data === 'generate') {
    run();
  }
};

const run = () => {
  const generator = new Generator();
  if (generator.generate()) {
    const { puzzle } = generator.getPuzzleData();
    self.postMessage({
      puzzle,
    });
  }
};
