import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { SudokuSet } from '../../model/SudokuSet';
import { IStrategy } from './IStrategy';

/**
 * This strategy requires notes as it eliminates candidates
 * from lines based on the position of missing numbers in a block.
 *
 * If a block can only contain a missing number in a row or column they can't
 * be present in the rest of that line.
 * We could thus remove the missing number from then candidates of that line that are not in the same block.
 */
export class PointingCandidates implements IStrategy {
  public get rating() {
    return Rating.Hard;
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

      const blocks = sudoku.blocks;
      for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
        const block = blocks[blockIndex];
        const emptyCells = block.cells.filter((cell) => !cell.value);
        const missingNumbers = block.missingNumbers;
        for (
          let missingIndex = 0;
          missingIndex < missingNumbers.length;
          missingIndex++
        ) {
          const missing = missingNumbers[missingIndex];
          const availableCells = emptyCells.filter((cell) =>
            cell.candidates.includes(missing)
          );
          const affectedRows = Array.from(
            new Set(availableCells.map((cell) => cell.row))
          );
          const affectedColumns = Array.from(
            new Set(availableCells.map((cell) => cell.column))
          );

          const simplify = (affectedCells: SudokuSet[]) => {
            if (affectedCells.length === 1) {
              affectedCells[0].cells.forEach((cell) => {
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
          // Only check columns if rows did not alter candidates
          if (!changed) {
            simplify(affectedColumns);
          }
        }
      }
    }
    return result;
  }
}