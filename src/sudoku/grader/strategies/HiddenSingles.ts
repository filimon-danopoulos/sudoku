import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';
import { IStrategy } from './IStrategy';

export class HiddenSingles implements IStrategy {
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
      for (let cellIndex = 0; cellIndex < sudoku.cells.length; cellIndex++) {
        const emptyCell = sudoku.cells[cellIndex];
        if (!emptyCell.value) {
          for (
            let candidateIndex = 0;
            candidateIndex < emptyCell.candidates.length;
            candidateIndex++
          ) {
            const candidate = emptyCell.candidates[candidateIndex];

            const sets = [emptyCell.block, emptyCell.column, emptyCell.row];
            sets.forEach((set) => {
              const influencers = set.cells.filter(
                (cell) => cell !== emptyCell && cell.candidates.length > 0
              );
              if (
                influencers.every((influencer) =>
                  influencer.candidates.every((c) => c !== candidate)
                )
              ) {
                emptyCell.value = candidate;
                changed = result = true;
              }
            });
          }
        }
      }
    }
    return result;
  }
}
