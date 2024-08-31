import { Grader } from '../src/sudoku/grader/Grader';
import { Rating } from '../src/sudoku/grader/Rating';
import { Sudoku } from '../src/sudoku/model/Sudoku';
const puzzles = ['300967001040302080020000070070000090000873000500010003004705100905000207800621004'];
const example = puzzles[0];

const sudoku = new Sudoku(example);
console.log(sudoku.cells.map((c) => c.value ?? 0).join(''));
const grader = new Grader();
const { rating, steps } = grader.grade(sudoku);
console.log(sudoku.cells.map((c) => c.value ?? 0).join(''));

console.log(Rating[rating]);
