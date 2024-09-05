import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

// rows: 005000400020940000900700008003000290100203007079000300400008001000014060006000700
// columns: 003910700000003400100040006060700000002109600000002010700080003008200000005071900

export class XWing implements IStrategy {
  get rating() {
    return Rating.Hard;
  }

  run(sudoku: Sudoku) {
    const rowResult = this.#run(sudoku, 'rows');
    if (rowResult.changed) {
      return rowResult;
    }
    return this.#run(sudoku, 'columns');
  }

  // TODO: optimize
  // TODO: generalize to swordfish
  #run(sudoku: Sudoku, direction: 'rows' | 'columns') {
    const lines = sudoku[direction];
    const opposite = direction === 'rows' ? 'column' : 'row';
    const same = direction === 'rows' ? 'row' : 'column';
    for (let value = 1; value <= 9; value++) {
      const linesWithTwoCandidateCells = lines.filter(
        (line) => line.cells.filter((cell) => cell.candidates.includes(value)).length == 2
      );
      for (const line of linesWithTwoCandidateCells) {
        const candidateCells = line.cells.filter((cell) => cell.candidates.includes(value));
        const otherLine = linesWithTwoCandidateCells.find((otherLine) => {
          if (line !== otherLine) {
            const otherCandidateCells = otherLine.cells.filter((cell) => cell.candidates.includes(value));
            return candidateCells.every(
              (cell, index) => cell[opposite].index === otherCandidateCells[index][opposite].index
            );
          }
          return false;
        });
        if (otherLine) {
          const cellsToUpdate = candidateCells
            .flatMap((cell) => cell[opposite].cells)
            .filter((cell) => {
              return cell[same] !== line && cell[same] !== otherLine && cell.candidates.includes(value);
            });
          if (cellsToUpdate.length) {
            for (const cell of cellsToUpdate) {
              cell.candidates.splice(cell.candidates.indexOf(value), 1);
            }
            return { changed: true, description: 'xwing' };
          }
        }
      }
    }

    return { changed: false };
  }
}
