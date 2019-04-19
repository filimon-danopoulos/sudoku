
import Puzzles from "./puzzles.json"
import { DIFFICULTY } from "./models/Difficulty";
import Sudoku from "./models/Sudoku";
import GeneratePuzzleWorker from "./workers/GeneratePuzzle.worker"
import { v4 as uuid } from "uuid"

const EMPTY_DATA: [number, boolean][][] = [
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]],
  [[1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false], [1, false]]
]

const PUZZLE_MAP_KEY = "PUZZLE-MAP"
const BUFFER_SIZE = 20

type idMap = { [key: number]: string[] }
type serializedPuzzle = (number | boolean)[][][]

class PuzzleStorage {
  private worker: Worker;

  constructor() {
    this.inititializeStorage()
    this.worker = new GeneratePuzzleWorker() as Worker;
    this.worker.addEventListener('message', e => this.addPuzzle(e))
  }

  private inititializeStorage() {
    if (!this.hasLocalStorageKeys()) {
      const puzzles: idMap = {
        [DIFFICULTY.VeryEasy]: this.saveJSONPuzzles(Puzzles.VeryEasy),
        [DIFFICULTY.Easy]: this.saveJSONPuzzles(Puzzles.Easy),
        [DIFFICULTY.Normal]: this.saveJSONPuzzles(Puzzles.Normal),
        [DIFFICULTY.Hard]: this.saveJSONPuzzles(Puzzles.Hard),
        [DIFFICULTY.VeryHard]: this.saveJSONPuzzles(Puzzles.VeryHard)
      }
      this.save(PUZZLE_MAP_KEY, puzzles)
    }
  }

  private hasLocalStorageKeys(): boolean {
    return !!window.localStorage[PUZZLE_MAP_KEY]
  }

  private saveJSONPuzzles(puzzles: serializedPuzzle[]): string[] {
    return puzzles.map(p => {
      const id = uuid();
      this.save(id, p)
      return id;
    })
  }

  private decodeStoredPuzzle(puzzle: serializedPuzzle): Sudoku {
    const decodedPuzle = [[], [], [], [], [], [], [], [], []] as [number, boolean][][];
    puzzle.forEach((row, i) => {
      decodedPuzle[i] = row.map(([value, given]) => [value, given] as [number, boolean])
    })
    return Sudoku.create(decodedPuzle)
  }

  public getPuzzle(difficulty: DIFFICULTY): Sudoku {
    const puzzleMap = this.load<idMap>(PUZZLE_MAP_KEY);
    const id = puzzleMap[difficulty].shift()
    if (!id) {
      return Sudoku.create(EMPTY_DATA)
    }
    const puzzle = this.load<serializedPuzzle>(id)
    const sudoku = this.decodeStoredPuzzle(puzzle)
    this.save(PUZZLE_MAP_KEY, puzzleMap);
    this.worker.postMessage(difficulty)

    if (!!sudoku) {
      return sudoku
    }
    return Sudoku.create(EMPTY_DATA)
  }

  private addPuzzle(message: MessageEvent): void {
    const difficulty = message.data.difficulty as DIFFICULTY;
    const data = message.data.puzzleData as [number, boolean][][];
    const id = uuid();
    const puzzleMap = this.load<idMap>(PUZZLE_MAP_KEY);
    puzzleMap[difficulty].push(id);
    this.save(id, data)
    this.save(PUZZLE_MAP_KEY, puzzleMap)
    if (puzzleMap[difficulty].length < BUFFER_SIZE) {
      this.worker.postMessage(difficulty)
    }
  }

  private save(key: string, data: any): void {
    window.localStorage.setItem(key, JSON.stringify(data))
  }

  private load<T>(key: string): T {
    return JSON.parse(window.localStorage[key]) as T
  }
}

export default new PuzzleStorage();