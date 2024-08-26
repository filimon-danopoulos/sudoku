import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class HiddenTuples implements IStrategy {
  constructor(private size: number) {}
  public get rating() {
    return Rating.Hard;
  }
  run(sudoku: Sudoku): boolean {
    // console.log('Singles');

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
        const missingNumbers = set.missingNumbers;
        const combinations = this.combine(missingNumbers, this.size);
        combinations.forEach((combination) => {
          const candidateCells = set.cells.filter(
            (cell) =>
              cell.candidates.length > 0 &&
              cell.candidates.some((candidate) =>
                combination.includes(candidate)
              )
          );
          if (candidateCells.length === this.size) {
            const cover = new Set(
              candidateCells.flatMap((cell) => cell.candidates)
            );
            if (combination.every((value) => cover.has(value))) {
              combination.forEach((candidate) => {
                const affectedCells = set.cells.filter(
                  (cell) =>
                    !candidateCells.includes(cell) && cell.candidates.length > 0
                );
                affectedCells.forEach((cell) => {
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
