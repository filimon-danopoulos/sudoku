import { DIFFICULTY } from "./Difficulty";
import Solver from "./Solver";

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

export default class Generator {
  private solution: number[][];
  private data: (null | number)[][];

  constructor(private difficulty: DIFFICULTY) {
    this.solution = this.shuffle(BASE)
    this.data = [];
  }

  public generate() {
    const startAt = Date.now()
    this.data = this.solution.map(r => [...r])
    const removed = [] as string[]
    let allowedAttempts = 200;
    while (removed.length < this.difficulty && allowedAttempts--) {
      let row;
      let column;
      do {
        row = ~~(Math.random() * 9);
        column = ~~(Math.random() * 9);
      } while (removed.includes(`${row}:${column}`))
      let value = this.data[row][column]
      this.data[row][column] = null
      const solver = new Solver(this.data)
      if (solver.hasUniqueSolution()) {
        removed.push(`${row}:${column}`)
      } else {
        this.data[row][column] = value
      }
    }
    const ellapsedTime = Date.now() - startAt

    if (allowedAttempts > 0) {
      console.log(`It took ${ellapsedTime}ms to generate a ${DIFFICULTY[this.difficulty]} puzzle`)
      return true
    } else {
      console.log(`Failed to generate a ${DIFFICULTY[this.difficulty]} puzzle after ${ellapsedTime}ms`)
      return false
    }
  }

  private shuffle(base: number[][]): number[][] {
    const data = BASE.map(r => [...r]);
    for (let i = 0; i < 4200; i++) {
      this.moveRowOrColumn(data);
    }
    return data;
  }

  public getPuzzleData(): ([number, boolean])[][] {
    return this.data.map((r, i) => r.map((y, l) => [this.solution[i][l], this.solution[i][l] === this.data[i][l]] as [number, boolean]));
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
}
