import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class NakedTuples implements IStrategy {
  constructor(private size: number) {}
  public get rating() {
    return Rating.Normal;
  }
  run(sudoku: Sudoku): boolean {
    let initial = true;
    let changed = false;
    let result = changed;
    while (initial || changed) {
      if (initial) {
        initial = false;
      }
      changed = false;
      const sets = [...sudoku.blocks, ...sudoku.rows, ...sudoku.columns];
      sets.forEach((set) => {
        const cells = set.cells.filter((cell) => cell.candidates.length > 0);
        const combinations = this.combine(cells, this.size);
        combinations.forEach((combination) => {
          if (combination.length === this.size) {
            const candidates = Array.from(
              new Set(combination.flatMap((cell) => cell.candidates))
            );
            if (candidates.length === this.size) {
              candidates.forEach((candidate) => {
                const others = set.cells.filter(
                  (cell) => !combination.includes(cell)
                );
                others.forEach((cell) => {
                  const removeIndex = cell.candidates.indexOf(candidate);
                  if (removeIndex !== -1) {
                    cell.candidates.splice(removeIndex, 1);
                    changed = result = true;
                  }
                });
              });
            }
          }
        });
      });
    }

    return result;
  }

  private combine<T>(alternatives: T[], size: number): T[][] {
    if (size === 1) {
      return alternatives.map((alternative) => [alternative]);
    }

    return alternatives.flatMap((alternative, index) =>
      this.combine(alternatives.slice(index + 1), size - 1).map((z) => [
        alternative,
        ...z,
      ])
    );
  }
}
