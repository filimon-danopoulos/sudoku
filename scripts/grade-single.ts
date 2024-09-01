import { Grader } from '../src/sudoku/grader/Grader';
import { Rating } from '../src/sudoku/grader/Rating';
import { Sudoku } from '../src/sudoku/model/Sudoku';
const puzzles = ['000810060000052800000940020905000600017008000060095040070300018500007902000000400'];
const example = puzzles[0];

const sudoku = new Sudoku(example);
console.log(sudoku.cells.map((c) => c.value ?? 0).join(''));
const grader = new Grader();
const { rating } = grader.grade(sudoku);
console.log(sudoku.cells.map((c) => c.value ?? 0).join(''));

console.log(Rating[rating]);
