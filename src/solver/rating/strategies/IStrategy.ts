import { RatedSudoku, Rating } from '../RatedSudoku';

export interface IStrategy {
  rating: Rating;
  run(sudoku: RatedSudoku): boolean;
}
