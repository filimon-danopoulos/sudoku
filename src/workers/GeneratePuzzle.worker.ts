import Generator from '../models/Generator';
import { DIFFICULTY } from '../models/Difficulty';

const ctx: Worker = self as any;

ctx.addEventListener('message', message => {
  const difficulty = message.data as DIFFICULTY;
  const puzzleData = runGenerator(difficulty);
  ctx.postMessage({
    puzzleData,
    difficulty
  });
});

function runGenerator(difficulty: DIFFICULTY): [number, boolean][][] {
  let tries = 10;
  do {
    const generator = new Generator(difficulty);
    if (generator.generate()) {
      return generator.getPuzzleData();
    }
  } while (--tries);
  throw new Error('Could not generate puzzle.');
}

export default null as any;
