import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class NakedSingles implements IStrategy {
  get rating() {
    return Rating.Moderate;
  }

  run(sudoku: Sudoku) {
    for (let cellIndex = 0; cellIndex < sudoku.cells.length; cellIndex++) {
      const cell = sudoku.cells[cellIndex];
      if (cell.candidates.length === 1) {
        cell.value = cell.candidates[0];
        return { changed: true, description: 'naked singles' };
      }
    }
    return { changed: false };
  }
}
