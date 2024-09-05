import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class NakedTuples implements IStrategy {
  get rating() {
    return Rating.Moderate;
  }

  #size: 2 | 3 | 4;

  constructor(size: 2 | 3 | 4) {
    this.#size = size;
  }

  run(sudoku: Sudoku) {
    const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];

    for (let setIndex = 0; setIndex < sets.length; setIndex++) {
      const set = sets[setIndex];
      const cells = set.cells.filter((cell) => cell.candidates.length > 0);
      const combinations = this.#combine(cells, this.#size);

      for (let combinationIndex = 0; combinationIndex < combinations.length; combinationIndex++) {
        const combination = combinations[combinationIndex];
        if (combination.length === this.#size) {
          const candidates = Array.from(new Set(combination.flatMap((cell) => cell.candidates)));
          if (candidates.length === this.#size) {
            let dirty = false;
            let description = 'naked tuples';

            candidates.forEach((candidate) => {
              const others = set.cells.filter(
                (cell) => cell.candidates.includes(candidate) && !combination.includes(cell)
              );
              others.forEach((cell) => {
                const removeIndex = cell.candidates.indexOf(candidate);
                if (removeIndex !== -1) {
                  cell.candidates.splice(removeIndex, 1);
                  description += ` | removing candidate ${candidate} in cell (${cell.row.index + 1}, ${cell.column.index + 1}))`;
                  dirty = true;
                }
              });
            });
            if (dirty) {
              return { changed: true, description };
            }
          }
        }
      }
    }

    return { changed: false };
  }

  #combine<T>(alternatives: T[], size: number): T[][] {
    if (size === 1) {
      return alternatives.map((alternative) => [alternative]);
    }

    return alternatives.flatMap((alternative, index) =>
      this.#combine(alternatives.slice(index + 1), size - 1).map((z) => [alternative, ...z])
    );
  }
}
