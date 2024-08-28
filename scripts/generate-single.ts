import { Generator } from '../src/sudoku/generator/Generator';

const generator = new Generator();
const start = performance.now();
const success = generator.generate();
const ellapsed = performance.now() - start;
if (success) {
  console.log(`completed after ${ellapsed}ms`);
  const puzzle = generator.getPuzzleData();
  const str = puzzle
    .map((row) => row.map(([cell, given]) => (given ? cell : cell / 10)).join())
    .join();
  console.log(str);
} else {
  console.log(`failed after ${ellapsed}ms`);
}
