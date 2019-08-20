import LinkedSparseMatrix from './LinkedMatrix';
import MatrixEntry from './MatrixEntry';

type metadata = {
  row: number;
  column: number;
  block: number;
  value: number;
};

/**
 * A solver that uses DLX to solve puzzles. It is expensive to initialize.
 * However it is stateless so once it has been initialized it can be be used to solve many puzzles.
 */
export default class SudokuSolver {
  private rowMetaData: metadata[];
  private sudokuRuleMatrix: boolean[][];

  constructor() {
    this.rowMetaData = this.generateMatrixRows();
    this.sudokuRuleMatrix = this.generateSudokuRuleMatrix();
  }

  /**
   * Solves a sudoku by initializing the the recursive link dancing.
   * Returns an array containing the rows that solve the array. It is fairly useless unless
   * it is mapped to actual values.
   */
  public solve(sudoku: (number | null)[][]): number[][] {
    const sudokuRuleMatrixWithGivenNumbers = this.applyGivenNumbersToRules(sudoku);
    const linkedmatrix = new LinkedSparseMatrix(sudokuRuleMatrixWithGivenNumbers);
    const solutions = [] as number[][];
    const stack = [] as number[];

    this.recurse(linkedmatrix, solutions, stack);

    return solutions;
  }

  /**
   * Since a puzzle has clues, the entire matrix is not used.
   * Only the rows that represent empty cells and given cells
   * are included in the matrix that is represents the exact cover problem.
   */
  private applyGivenNumbersToRules(sudoku: (number | null)[][]): boolean[][] {
    return this.sudokuRuleMatrix.filter((r, i) => {
      const metadata = this.rowMetaData[i];
      const cellValue = sudoku[metadata.row][metadata.column];
      return cellValue === null || cellValue === metadata.value;
    });
  }

  /**
   * Implements the DLX algorithm, explained further here: https://arxiv.org/abs/cs/0011047
   * In order to keep it stateless an array is passed around that includes all the found solutions.
   * The current attempt is also passed around.
   */
  private recurse(
    linkedmatrix: LinkedSparseMatrix,
    solutions: number[][],
    currentAttempt: number[]
  ): void {
    const succeeded = linkedmatrix.Root.Right === linkedmatrix.Root;
    if (succeeded) {
      solutions.push([...currentAttempt].sort());
      return;
    }

    const bestColumn = this.findBestColumnToStartAt(linkedmatrix.Root);
    const failed = bestColumn.Size < 1;
    if (failed) {
      return;
    }

    const bestColumnIndex = linkedmatrix.getColumnIndexOf(bestColumn);
    linkedmatrix.cover(bestColumnIndex);
    for (let row = bestColumn.Down; row !== bestColumn; row = row.Down) {
      currentAttempt.push(row.Y);
      for (let entry = row.Right; entry !== row; entry = entry.Right) {
        linkedmatrix.cover(entry.X);
      }
      this.recurse(linkedmatrix, solutions, currentAttempt);
      for (let entry = row.Left; entry !== row; entry = entry.Left) {
        linkedmatrix.uncover(entry.X);
      }
      currentAttempt.pop();
    }
    linkedmatrix.uncover(bestColumnIndex);
  }

  /**
   * The column used to start each itteration in the algorithm can be select anyway
   * that I see fit. Knuth suggest selecting the column with the fewest entried so
   * that is what I do here.
   */
  private findBestColumnToStartAt(root: MatrixEntry): MatrixEntry {
    let bestColumn = root.Right;
    for (let column = bestColumn.Right; column !== root; column = column.Right) {
      if (column.Size < bestColumn.Size) {
        bestColumn = column;
      }
    }
    return bestColumn;
  }

  /**
   * Generates a matrix based on the row metadata created earlier.
   * The columns are crated from the restrictions that apply to a puzzle.
   * 1) A cell can only contain a single value, represented by cellConstraints
   * 2) A row can only contain a specific value once, represented by rowConstraints
   * 3) A column can only contain a specific value, represented by columnConstraints
   * 4) A block can only contain a specific value, represented by blockConstraints
   */
  private generateSudokuRuleMatrix(): boolean[][] {
    return this.rowMetaData.map(entry => {
      const cellConstraints = this.getCellContraints(entry);
      const rowContraints = this.getRowContraints(entry);
      const columnContraints = this.getColumnConstraints(entry);
      const blockConstraints = this.getBlockConstraints(entry);
      return [...cellConstraints, ...rowContraints, ...columnContraints, ...blockConstraints];
    });
  }
  private getCellContraints(entry: metadata): boolean[] {
    const result = [] as boolean[];
    const cell = entry.row * 9 + entry.column;
    for (let i = 0; i < 81; i++) {
      result.push(i === cell);
    }
    return result;
  }

  private getRowContraints(entry: metadata): boolean[] {
    const result = [] as boolean[];
    for (let row = 0; row < 9; row++) {
      for (let value = 1; value <= 9; value++) {
        result.push(entry.value === value && entry.row === row);
      }
    }
    return result;
  }

  private getColumnConstraints(entry: metadata): boolean[] {
    const result = [] as boolean[];
    for (let column = 0; column < 9; column++) {
      for (let value = 1; value <= 9; value++) {
        result.push(entry.value === value && entry.column === column);
      }
    }
    return result;
  }

  private getBlockConstraints(entry: metadata): boolean[] {
    const result = [] as boolean[];
    for (let block = 0; block < 9; block++) {
      for (let value = 1; value <= 9; value++) {
        result.push(entry.value === value && entry.block === block);
      }
    }
    return result;
  }

  /**
   * Generates the rows that are used to create the matrix that is used to find
   * an exact cover.The row metadata contains the row, columns, block and value
   * of the cell in the sudoku. An entry represent the sudoku row column and
   * value in all permutaions.
   */
  private generateMatrixRows(): metadata[] {
    const result = [] as metadata[];
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        for (let value = 1; value <= 9; value++) {
          const block = Math.floor(row / 3) * 3 + Math.floor(column / 3);
          result.push({
            row,
            column,
            block,
            value
          });
        }
      }
    }

    return result;
  }
}
