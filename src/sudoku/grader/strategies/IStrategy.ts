import { Rating } from '../Rating';
import { Sudoku } from '../../model/Sudoku';

export interface IStrategy {
  rating: Rating;
  name: string;
  description: string;
  run(sudoku: Sudoku): boolean;
}
