import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';

export interface IStrategy {
  rating: Rating;
  run(sudoku: Sudoku): boolean;
}
