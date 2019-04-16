import { DIFFICULTY } from "./Difficulty";

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

const repeat = (times: number) => [...Array(times).keys()]
const range = (start: number, end: number) => repeat(end + 1).slice(start)

export default class GeneratorNew {
  private solution: number[][];
  private data: nullber[][];

  constructor(private difficulty: DIFFICULTY) {
    this.solution = this.shuffle(BASE)
    do {
      this.data = this.solution.map(r => [...r])
      this.removeValues();
    } while (this.hasUniqueSolution())
  }

  private shuffle(base: number[][]): number[][] {
    const data = BASE.map(r => [...r]);
    for (let i = 0; i < 42e3; i++) {
      this.moveRowOrColumn(data);
    }
    return data;
  }


  public execute(): ([number, boolean])[][] {
    return this.data.map((r, i) => r.map((y, l) => [this.solution[i][l], this.solution[i][l] === this.data[i][l]] as [number, boolean]));
  }

  private removeValues() {
    let cellsToRemove = this.difficulty as number
    while (cellsToRemove) {
      const x = Math.floor(Math.random() * 9);
      const y = Math.floor(Math.random() * 9);
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
    let to = Math.floor(Math.random() * 3);
    if (to === from) {
      return this.getFromAndTo(from);
    }
    const block = Math.floor(Math.random() * 3);
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
    return this.solve(flatData) === 1
  }

  private solve(data: nullber[]): number {
    let candidates = this.findCandidates(data);
    let firstEmpty = data.indexOf(null)
    if (firstEmpty === -1) {
      return 1
    }
    if (candidates.some(c => c.length === 0)) {
      return 0
    }

    return candidates[firstEmpty].reduce((sum, candidate) => {
      const updatedData = [...data]
      updatedData[firstEmpty] = candidate
      return sum + this.solve(updatedData)
    }, 0);
  }

  private segment(data: nullber[]): segments {
    const rows: nullber[][] = repeat(9).map(x => [])
    const blocks: nullber[][] = repeat(9).map(x => [])
    const columns: nullber[][] = repeat(9).map(x => [])

    data.forEach((v, i) => {
      const { row, column, block } = this.findParents(i);
      rows[row].push(v)
      blocks[block].push(v)
      columns[column].push(v)
    });
    return {
      rows,
      blocks,
      columns
    }
  }

  private findParents(index: number): { row: number, column: number, block: number } {
    const row = Math.floor(index / 9);
    const column = index % 9
    const block = Math.floor(row / 3) * 3 + Math.floor(column / 3)

    return {
      block,
      row,
      column
    }
  }

  private findCandidates(data: nullber[]) {
    const { rows, blocks, columns } = this.segment(data)
    return data.map((value, i) => {
      if (value === null) {
        const { row, column, block } = this.findParents(i)
        return range(1, 9).filter(x => {
          return !blocks[block].includes(x)
            && !rows[row].includes(x)
            && !columns[column].includes(x)
        })
      }
      return [value]
    })
  }

  public candidates(): number[][][] {
    const flatData = this.data.reduce((s, x) => s.concat(x), []);
    const candidates = this.findCandidates(flatData);
    return range(0, 8).map(r => range(0, 8).map(c => candidates[r * 9 + c]))
  }
}

type segments = {
  rows: nullber[][]
  blocks: nullber[][]
  columns: nullber[][]
}

type nullber = number | null