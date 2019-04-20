import { DIFFICULTY } from "./Difficulty";
import { start } from "repl";
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
  private success: boolean;
  private solution: number[][];
  private data: (null | number)[][];

  constructor(private difficulty: DIFFICULTY) {
    this.solution = this.shuffle(BASE)
    let maxItterations = 20;
    do {
      this.data = this.solution.map(r => [...r])
      this.removeValues();
      const solver = new Solver(this.data);
      if (solver.hasUniqueSolution()) {
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
}
