export default class Analyzer {
  constructor(private data: nullber[][]) {}

  private segment<T>(data: T[]): segments<T> {
    const rows: T[][] = [[], [], [], [], [], [], [], [], []];
    const blocks: T[][] = [[], [], [], [], [], [], [], [], []];
    const columns: T[][] = [[], [], [], [], [], [], [], [], []];

    for (let i = 0; i < 81; i++) {
      const v = data[i];
      const { row, column, block } = this.findParents(i);
      rows[row].push(v);
      blocks[block].push(v);
      columns[column].push(v);
    }

    return {
      rows,
      blocks,
      columns
    };
  }

  private findParents(index: number): { row: number; column: number; block: number } {
    const row = ~~(index / 9);
    const column = index % 9;
    const block = ~~(row / 3) * 3 + ~~(column / 3);

    return {
      block,
      row,
      column
    };
  }

  private findCandidates(data: nullber[]) {
    const { rows, blocks, columns } = this.segment(data);
    const candidates: number[][] = [];
    for (let i = 0; i < 81; i++) {
      const value = data[i];
      candidates[i] = [];
      if (value !== null) {
        candidates[i].push(value);
      } else {
        const { row, column, block } = this.findParents(i);
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
        return false;
      }
    }
    return true;
  }

  public getCandidates(): number[][][] {
    const flatData = this.data.reduce((s, x) => s.concat(x), []);
    const candidates = this.findCandidates(flatData);
    const result = [] as number[][][];
    for (let row = 0; row < 9; row++) {
      result[row] = [];
      for (let column = 0; column < 9; column++) {
        result[row][column] = candidates[row * 9 + column];
      }
    }
    return result;
  }
}

type nullber = number | null;

type segments<T> = {
  rows: T[][];
  blocks: T[][];
  columns: T[][];
};
