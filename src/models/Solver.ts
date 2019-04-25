
const repeat = (times: number) => [...Array(times).keys()]
const range = (start: number, end: number) => repeat(end + 1).slice(start)

export default class Solver {
  constructor(private data: nullber[][]) {

  }

  public hasUniqueSolution(): boolean {
    const data = this.data.reduce((s, x) => s.concat(x), []);
    const solution1 = this.solve(data, true)
    const solution2 = this.solve(data, false)
    return solution1 === solution2
  }

  private solve(data: nullber[], reverseCandidates: boolean): string {
    const candidates = this.findCandidates(data)
    if (reverseCandidates) {
      candidates.forEach(c => c.reverse())
    }

    if (this.isSolved(candidates)) {
      return candidates.map(c => c[0]).join('');
    }
    if (this.isUnsolvable(candidates)) {
      return '';
    }
    let startIndex = this.getStartIndex(candidates);

    const values = candidates[startIndex]

    const iMax = values.length
    for (let i = 0; i < iMax; i++) {
      const value = values[i]
      const localData = [...data]
      localData[startIndex] = value
      const solution = this.solve(localData, reverseCandidates)
      if (solution) {
        return solution
      }
    }
    return ''
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
