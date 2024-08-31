import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class HiddenTuples implements IStrategy {
  get name() {
    const types = {
      2: 'doubles',
      3: 'tripplets',
      4: 'quadrouples',
    };

    return `hidden ${types[this.#size]}`;
  }

  description = '';

  get rating() {
    return Rating.Hard;
  }

  #size: 2 | 3 | 4;

  constructor(size: 2 | 3 | 4) {
    this.#size = size;
  }

  run(sudoku: Sudoku): boolean {
    const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];
    sets.forEach((set) => {
      const missingNumbers = set.missingNumbers;
      const combinations = this.#combine(missingNumbers, this.#size);
      combinations.forEach((combination) => {
        const candidateCells = set.cells.filter(
          (cell) => cell.candidates.length > 0 && cell.candidates.some((candidate) => combination.includes(candidate))
        );
        if (candidateCells.length === this.#size) {
          const cover = new Set(candidateCells.flatMap((cell) => cell.candidates));
          if (combination.every((value) => cover.has(value))) {
            combination.forEach((candidate) => {
              const affectedCells = set.cells.filter(
                (cell) => !candidateCells.includes(cell) && cell.candidates.length > 0
              );
              affectedCells.forEach((cell) => {
                const removeIndex = cell.candidates.indexOf(candidate);
                if (removeIndex !== -1) {
                  cell.candidates.splice(removeIndex, 1);
                  return true;
                }
              });
            });
          }
        }
      });
    });
    return false;
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
