import { RatedSudoku, Rating } from '../RatedSudoku';
import { IStrategy } from './IStrategy';

export class NakedDoubles implements IStrategy {
  public get rating() {
    return Rating.Normal;
  }
  run(sudoku: RatedSudoku): boolean {
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
      // eslint-disable-next-line no-loop-func
      sets.forEach(set => {
        const cells = set.cells.filter(cell => cell.candidates.length === 2);
        cells.forEach(cell => {
          const match = cells.find(
            otherCell =>
              otherCell !== cell &&
              otherCell.candidates[0] === cell.candidates[0] &&
              otherCell.candidates[1] === cell.candidates[1]
          );
          if (typeof match !== 'undefined') {
            const otherCells = cells.filter(
              otherCell => otherCell.candidates && otherCell !== cell && otherCell !== match
            );
            otherCells.forEach(otherCell => {
              const firstRemoveIndex = otherCell.candidates.indexOf(match!.candidates[0]);
              if (firstRemoveIndex !== -1) {
                otherCell.candidates.splice(firstRemoveIndex, 1);
                changed = result = true;
              }
              const secondRemoveIndex = otherCell.candidates.indexOf(match!.candidates[1]);
              if (secondRemoveIndex !== -1) {
                otherCell.candidates.splice(secondRemoveIndex, 1);
                changed = result = true;
              }
            });
          }
        });
      });
    }
    return result;
  }
}
