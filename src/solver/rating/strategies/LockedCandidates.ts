import { RatedSet, RatedSudoku, Rating } from '../RatedSudoku';
import { IStrategy } from './IStrategy';

export class LockedCandidates implements IStrategy {
  public get rating() {
    return Rating.Hard;
  }
  run(sudoku: RatedSudoku): boolean {
    let initial = true;
    let changed = false;
    let result = changed;
    while (initial || changed) {
      if (initial) {
        initial = false;
      }
      changed = false;

      const blocks = sudoku.blocks;
      for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        const block = blocks[blockIndex];
        const emptyCells = block.cells.filter(cell => !cell.value);
        const missingNumbers = block.missingNumbers;
        for (let missingIndex = 0; missingIndex < missingNumbers.length; missingIndex++) {
          const missing = missingNumbers[missingIndex];
          const availableCells = emptyCells.filter(cell => cell.candidates.includes(missing));
          const affectedRows = Array.from(new Set(availableCells.map(cell => cell.row)));
          const affectedColumns = Array.from(new Set(availableCells.map(cell => cell.column)));

          // eslint-disable-next-line no-loop-func
          const simplify = (affectedCells: RatedSet[]) => {
            if (affectedCells.length === 1) {
              affectedCells[0].cells.forEach(cell => {
                if (cell.block !== block) {
                  const removeIndex = cell.candidates.indexOf(missing);
                  if (removeIndex !== -1) {
                    cell.candidates.splice(removeIndex, 1);
                    changed = result = true;
                  }
                }
              });
            }
          };

          simplify(affectedRows);
          simplify(affectedColumns);
        }
      }
    }
    return result;
  }
}
