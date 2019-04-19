import Generator from "../models/Generator"
import { DIFFICULTY } from "../models/Difficulty";

const ctx: Worker = self as any;

ctx.addEventListener("message", (message) => {
  const difficulty = message.data as DIFFICULTY;
  const generator = new Generator(difficulty);
  if (generator.succeeded()) {
    const puzzleData = generator.getPuzzleData();
    ctx.postMessage({
      puzzleData,
      difficulty
    })
  } else {
    throw new Error("Could not generate puzzle.")
  }
})

export default null as any