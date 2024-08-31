import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class NakedTuples implements IStrategy {
  get name() {
    const types = {
      2: 'doubles',
      3: 'tripplets',
      4: 'quadrouples',
    };

    return `naked ${types[this.#size]}`;
  }

  description = '';

  get rating() {
    return Rating.Normal;
  }

  #size: 2 | 3 | 4;

  constructor(size: 2 | 3 | 4) {
    this.#size = size;
  }

  run(sudoku: Sudoku): boolean {
    const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];
    sets.forEach((set) => {
      const cells = set.cells.filter((cell) => cell.candidates.length > 0);
      const combinations = this.#combine(cells, this.#size);
      combinations.forEach((combination) => {
        if (combination.length === this.#size) {
          const candidates = Array.from(new Set(combination.flatMap((cell) => cell.candidates)));
          if (candidates.length === this.#size) {
            candidates.forEach((candidate) => {
              const others = set.cells.filter((cell) => !combination.includes(cell));
              others.forEach((cell) => {
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
