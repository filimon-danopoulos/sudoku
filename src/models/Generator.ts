import { DIFFICULTY } from "./Difficulty";
import { start } from "repl";

const BASE = [
  [3, 6, 1, 7, 2, 5, 9, 4, 8],
  [5, 8, 7, 9, 6, 4, 2, 1, 3],
  [4, 9, 2, 8, 3, 1, 6, 5, 7],
  [6, 3, 8, 2, 5, 9, 4, 7, 1],
  [1, 7, 4, 6, 8, 3, 5, 9, 2],
  [2, 5, 9, 1, 4, 7, 8, 3, 6],
  [7, 4, 6, 3, 9, 2, 1, 8, 5],
  [9, 2, 3, 5, 1, 8, 7, 6, 4],
  [8, 1, 5, 4, 7, 6, 3, 2, 9]
];

const ROw_INDECES = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 32, 33, 34, 35],
  [36, 37, 38, 39, 40, 41, 42, 43, 44],
  [45, 46, 47, 48, 49, 50, 51, 52, 53],
  [54, 55, 56, 57, 58, 59, 60, 61, 62],
  [63, 64, 65, 66, 67, 68, 69, 70, 71],
  [72, 73, 74, 75, 76, 77, 78, 79, 80]
]
const BLOCK_INDECES = [
  [0, 1, 2, 9, 10, 11, 18, 19, 20],
  [3, 4, 5, 12, 13, 14, 21, 22, 23],
  [6, 7, 8, 15, 16, 17, 24, 25, 26],
  [27, 28, 29, 36, 37, 38, 45, 46, 47],
  [30, 31, 32, 39, 40, 41, 48, 49, 50],
  [33, 34, 35, 42, 43, 44, 51, 52, 53],
  [54, 55, 56, 63, 64, 65, 72, 73, 74],
  [57, 58, 59, 66, 67, 68, 75, 76, 77],
  [60, 61, 62, 69, 70, 71, 78, 79, 80]
]
const COLUMN_INDECES = [
  [0, 9, 18, 27, 36, 45, 54, 63, 72],
  [1, 10, 19, 28, 37, 46, 55, 64, 73],
  [2, 11, 20, 29, 38, 47, 56, 65, 74],
  [3, 12, 21, 30, 39, 48, 57, 66, 75],
  [4, 13, 22, 31, 40, 49, 58, 67, 76],
  [5, 14, 23, 32, 41, 50, 59, 68, 77],
  [6, 15, 24, 33, 42, 51, 60, 69, 78],
  [7, 16, 25, 34, 43, 52, 61, 70, 79],
  [8, 17, 26, 35, 44, 53, 62, 71, 80]
]


const repeat = (times: number) => [...Array(times).keys()]
const range = (start: number, end: number) => repeat(end + 1).slice(start)

export default class Generator {
  private success: boolean;
  private solution: number[][];
  private data: nullber[][];

  constructor(private difficulty: DIFFICULTY) {
    this.solution = this.shuffle(BASE)
    let maxItterations = 20;
    do {
      this.data = this.solution.map(r => [...r])
      this.removeValues();
      if (this.hasUniqueSolution()) {
        break;
      }
    } while (--maxItterations)
    this.success = maxItterations !== 0
  }

  private shuffle(base: number[][]): number[][] {
    const data = BASE.map(r => [...r]);
    for (let i = 0; i < 4200; i++) {
      this.moveRowOrColumn(data);
    }
    return data;
  }

  public succeeded(): boolean {
    return this.success;
  }


  public getPuzzleData(): ([number, boolean])[][] {
    return this.data.map((r, i) => r.map((y, l) => [this.solution[i][l], this.solution[i][l] === this.data[i][l]] as [number, boolean]));
  }

  private removeValues() {
    let cellsToRemove = this.difficulty as number
    while (cellsToRemove) {
      const x = ~~(Math.random() * 9);
      const y = ~~(Math.random() * 9);
      const value = this.data[x][y]
      if (value !== null) {
        this.data[x][y] = null;
        --cellsToRemove;
      }
    }
  }

  private moveRowOrColumn(data: number[][]) {
    const [from, to] = this.getFromAndTo()
    if (!!Math.round(Math.random())) {
      this.moveColumn(data, from, to);
    } else {
      this.moveRow(data, from, to);
    }
  }

  private getFromAndTo(from: number = -1): [number, number] {
    from = from === -1 ? Math.floor(Math.random() * 3) : from;
    let to = ~~(Math.random() * 3);
    if (to === from) {
      return this.getFromAndTo(from);
    }
    const block = ~~(Math.random() * 3);
    return [block * 3 + from, block * 3 + to];
  }

  private moveRow(data: number[][], from: number, to: number) {
    const temp = data[to];
    data[to] = data[from];
    data[from] = temp;
  }

  private moveColumn(data: number[][], from: number, to: number) {
    data.forEach(row => {
      const temp = row[to];
      row[to] = row[from];
      row[from] = temp;
    });
  }

  public hasUniqueSolution(): boolean {
    const flatData = this.data.reduce((s, x) => s.concat(x), []);
    const candidates = this.findCandidates(flatData);
    const hasUniqueSolution = this.recurseOverCandidates(candidates)
    return hasUniqueSolution
  }

  private recurseOverCandidates(candidates: number[][]): boolean {
    if (this.isSolved(candidates)) return true;
    if (this.isUnsolvable(candidates)) return false;
    let startIndex = this.getStartIndex(candidates);

    const values = candidates[startIndex]

    const iMax = values.length
    let solutions = 0
    for (let i = 0; i < iMax; i++) {
      const value = values[i]
      const localCandidates = this.removeValueFromCandidates(candidates, startIndex, value)
      const couldSolve = this.recurseOverCandidates(localCandidates)
      if (couldSolve) {
        solutions += 1
      }
    }
    return solutions === 1
  }

  private removeValueFromCandidates(candidates: number[][], startIndex: number, value: number): number[][] {
    let localCandidates = [...candidates.map(x => [...x])]
    const { row, column, block } = this.findParents(startIndex)
    const removeFrom = [...ROw_INDECES[row], ...COLUMN_INDECES[column], ...BLOCK_INDECES[block]]
    for (let i = 0; i < 27; i++) {
      const removeFromIndex = removeFrom[i];
      localCandidates[removeFromIndex] = localCandidates[removeFromIndex].filter(c => c !== value)
    }
    localCandidates[startIndex] = [value]
    return localCandidates
  }

  private isSolved(candidates: number[][]): boolean {
    for (let i = 0; i < 81; i++) {
      if (candidates[i].length !== 1) {
        return false
      }
    }
    return true
  }

  private isUnsolvable(candidates: number[][]): boolean {
    for (let i = 0; i < 81; i++) {
      if (candidates[i].length === 0) {
        return true
      }
    }
    return false
  }

  private getStartIndex(candidates: number[][]): number {
    let startIndex = -1;
    let lowestNumberOfCandidates = 9;
    for (let i = 0; i < 81; i++) {
      const numberOfCandidates = candidates[i].length
      if (numberOfCandidates === 2) {
        return i;
      }

      if (numberOfCandidates > 2 && numberOfCandidates < lowestNumberOfCandidates) {
        startIndex = i;
        lowestNumberOfCandidates = numberOfCandidates
      }
    }
    if (startIndex === -1) {
      throw new Error("Couldn't find a good start index for further solving.")
    }
    return startIndex;
  }

  private segment<T>(data: T[]): segments<T> {
    const rows: T[][] = [[], [], [], [], [], [], [], [], []]
    const blocks: T[][] = [[], [], [], [], [], [], [], [], []]
    const columns: T[][] = [[], [], [], [], [], [], [], [], []]

    for (let i = 0; i < 81; i++) {
      const v = data[i]
      const { row, column, block } = this.findParents(i);
      rows[row].push(v)
      blocks[block].push(v)
      columns[column].push(v)
    }

    return {
      rows,
      blocks,
      columns
    }
  }

  private findParents(index: number): { row: number, column: number, block: number } {
    const row = ~~(index / 9);
    const column = index % 9
    const block = ~~(row / 3) * 3 + ~~(column / 3)

    return {
      block,
      row,
      column
    }
  }

  private findCandidates(data: nullber[]) {
    const { rows, blocks, columns } = this.segment(data)
    const candidates: number[][] = []
    for (let i = 0; i < 81; i++) {
      const value = data[i];
      candidates[i] = [];
      if (value !== null) {
        candidates[i].push(value);
      } else {
        const { row, column, block } = this.findParents(i)
        for (let candidate = 1; candidate <= 9; candidate++) {
          if (this.isAvailable(blocks[block], rows[row], columns[column], candidate)) {
            candidates[i].push(candidate);
          }
        }
      }
    }
    return candidates;
  }

  private isAvailable(block: nullber[], row: nullber[], column: nullber[], value: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (block[i] === value || row[i] === value || column[i] === value) {
        return false
      }
    }
    return true
  }

  public candidates(): number[][][] {
    const flatData = this.data.reduce((s, x) => s.concat(x), []);
    const candidates = this.findCandidates(flatData);
    return range(0, 8).map(r => range(0, 8).map(c => candidates[r * 9 + c]))
  }
}

type segments<T> = {
  rows: T[][]
  blocks: T[][]
  columns: T[][]
}

type nullber = number | null