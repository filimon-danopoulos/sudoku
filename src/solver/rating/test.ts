import Sudoku from '../../models/Sudoku';
import { Rating as RATING } from './RatedSudoku';
import { SudokuRater } from './SudokuRater';

const TEST: [number, boolean][][] = [
  [
    [3, false],
    [6, true],
    [1, true],
    [7, true],
    [2, false],
    [5, true],
    [9, true],
    [4, true],
    [8, true],
  ],
  [
    [5, true],
    [8, true],
    [7, true],
    [9, true],
    [6, true],
    [4, true],
    [2, true],
    [1, true],
    [3, true],
  ],
  [
    [4, true],
    [9, true],
    [2, true],
    [8, true],
    [3, true],
    [1, true],
    [6, true],
    [5, true],
    [7, true],
  ],
  [
    [6, true],
    [3, true],
    [8, true],
    [2, true],
    [5, true],
    [9, true],
    [4, true],
    [7, true],
    [1, true],
  ],
  [
    [1, true],
    [7, true],
    [4, true],
    [6, true],
    [8, true],
    [3, true],
    [5, true],
    [9, true],
    [2, true],
  ],
  [
    [2, true],
    [5, true],
    [9, true],
    [1, true],
    [4, true],
    [7, true],
    [8, true],
    [3, true],
    [6, true],
  ],
  [
    [7, true],
    [4, true],
    [6, true],
    [3, true],
    [9, true],
    [2, true],
    [1, true],
    [8, true],
    [5, true],
  ],
  [
    [9, true],
    [2, true],
    [3, true],
    [5, true],
    [1, true],
    [8, true],
    [7, true],
    [6, true],
    [4, true],
  ],
  [
    [8, true],
    [1, true],
    [5, true],
    [4, true],
    [7, true],
    [6, true],
    [3, true],
    [2, true],
    [9, true],
  ],
];

const rater = new SudokuRater();

const puzzleMap = JSON.parse(localStorage.getItem('PUZZLE-MAP')!) as Record<string, string[]>;
console.log(puzzleMap);
(window as any).rate = (fixed: boolean = false, difficulty: number = 30, skip: number = 0) => {
  const puzzles = puzzleMap[difficulty];
  const puzzleId = puzzles.slice(skip).shift()!;
  if (!puzzleId) {
    return;
  }
  const puzzle = fixed
    ? TEST
    : (JSON.parse(localStorage.getItem(puzzleId)!) as [number, boolean][][]);
  printPuzzle(puzzle);
  const solution = [] as (number | ' ')[][];
  const rating = rater.rate(Sudoku.create(puzzle), solution);
  printSolution(solution);
  console.log(RATING[rating]);
};

function printPuzzle(puzzle: [number, boolean][][]) {
  printGrid((row: number, column: number) => {
    const [value, given] = puzzle[row][column];
    return given ? value.toString() : ' ';
  });
}

function printSolution(solution: (number | ' ')[][]) {
  printGrid((row, column) => solution[row][column].toString());
}

function printGrid(h: (row: number, column: number) => string) {
  console.log(`
  +-------+-------+-------+
  | ${h(0, 0)} ${h(0, 1)} ${h(0, 2)} | ${h(0, 3)} ${h(0, 4)} ${h(0, 5)} | ${h(0, 6)} ${h(0, 7)} ${h(
    0,
    8
  )} |
  | ${h(1, 0)} ${h(1, 1)} ${h(1, 2)} | ${h(1, 3)} ${h(1, 4)} ${h(1, 5)} | ${h(1, 6)} ${h(1, 7)} ${h(
    1,
    8
  )} |
  | ${h(2, 0)} ${h(2, 1)} ${h(2, 2)} | ${h(2, 3)} ${h(2, 4)} ${h(2, 5)} | ${h(2, 6)} ${h(2, 7)} ${h(
    2,
    8
  )} |
  +-------+-------+-------+
  | ${h(3, 0)} ${h(3, 1)} ${h(3, 2)} | ${h(3, 3)} ${h(3, 4)} ${h(3, 5)} | ${h(3, 6)} ${h(3, 7)} ${h(
    3,
    8
  )} |
  | ${h(4, 0)} ${h(4, 1)} ${h(4, 2)} | ${h(4, 3)} ${h(4, 4)} ${h(4, 5)} | ${h(4, 6)} ${h(4, 7)} ${h(
    4,
    8
  )} |
  | ${h(5, 0)} ${h(5, 1)} ${h(5, 2)} | ${h(5, 3)} ${h(5, 4)} ${h(5, 5)} | ${h(5, 6)} ${h(5, 7)} ${h(
    5,
    8
  )} |
  +-------+-------+-------+
  | ${h(6, 0)} ${h(6, 1)} ${h(6, 2)} | ${h(6, 3)} ${h(6, 4)} ${h(6, 5)} | ${h(6, 6)} ${h(6, 7)} ${h(
    6,
    8
  )} |
  | ${h(7, 0)} ${h(7, 1)} ${h(7, 2)} | ${h(7, 3)} ${h(7, 4)} ${h(7, 5)} | ${h(7, 6)} ${h(7, 7)} ${h(
    7,
    8
  )} |
  | ${h(8, 0)} ${h(8, 1)} ${h(8, 2)} | ${h(8, 3)} ${h(8, 4)} ${h(8, 5)} | ${h(8, 6)} ${h(8, 7)} ${h(
    8,
    8
  )} |
  +-------+-------+-------+
`);
}
