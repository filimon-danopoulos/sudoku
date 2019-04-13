import {
  ISudokuState as IGameState,
  OptionActions,
  CHANGE_DIFFICULTY,
  NEW_GAME,
  VALIDATE_SOLUTION,
  TOGGLE_CELL,
  SET_DIGIT,
  NAVIGATE_CELLS,
  REMOVE_DIGIT,
  TOGGLE_NOTE_MODE
} from "./types";
import Sudoku from "../models/Sudoku";
import { DIFFICULTY } from "../models/Difficulty";

const initialState: IGameState = {
  difficulty: DIFFICULTY.Easy,
  sudoku: Sudoku.create(DIFFICULTY.Easy),
  noteMode: false
};

export function gameReducer(
  state = initialState,
  action: OptionActions
): IGameState {
  switch (action.type) {
    case CHANGE_DIFFICULTY:
      return {
        ...state,
        difficulty: action.payload,
        sudoku: Sudoku.create(action.payload)
      };
    case NEW_GAME:
      return {
        ...state,
        sudoku: Sudoku.create(state.difficulty)
      };
    case VALIDATE_SOLUTION:
      return {
        ...state,
        sudoku: state.sudoku.validate()
      };
    case TOGGLE_CELL:
      return {
        ...state,
        sudoku: state.sudoku.activateCell(action.payload.row, action.payload.column)
      };
    case SET_DIGIT:
      return {
        ...state,
        sudoku: state.sudoku.setDigit(action.payload.digit, state.noteMode)
      };
    case REMOVE_DIGIT:
      return {
        ...state,
        sudoku: state.sudoku.removeDigit()
      };
    case NAVIGATE_CELLS:
      return {
        ...state,
        sudoku: state.sudoku.navigate(action.payload.direction)
      };
    case TOGGLE_NOTE_MODE:
      return {
        ...state,
        noteMode: action.payload ? action.payload.value : !state.noteMode
      }
    default:
      return state;
  }
}
