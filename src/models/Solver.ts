import { DIFFICULTY } from "./Difficulty";

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

export default class Solver {
  constructor(private data: nullber[][]) {

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

  public getCandidates(): number[][][] {
    const flatData = this.data.reduce((s, x) => s.concat(x), []);
    const candidates = this.findCandidates(flatData);
    return range(0, 8).map(r => range(0, 8).map(c => candidates[r * 9 + c]))
  }
}

type nullber = number | null

type segments<T> = {
  rows: T[][]
  blocks: T[][]
  columns: T[][]
}
