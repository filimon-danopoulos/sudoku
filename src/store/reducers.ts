import {
  IGameState,
  OptionActions,
  CHANGE_DIFFICULTY,
  NEW_GAME,
  VALIDATE_SOLUTION,
  TOGGLE_CELL,
  SET_DIGIT,
  NAVIGATE_CELLS,
  REMOVE_DIGIT,
  TOGGLE_NOTE_MODE as SET_MODE,
  UNDO,
  REDO,
  MODE,
  TOGGLE_NIGHT_MODE,
  RESET_SUDOKU
} from "./types";
import Sudoku from "../models/Sudoku";
import { DIFFICULTY } from "../models/Difficulty";

const initialDifficulty = readDifficulty(DIFFICULTY.Easy)
const initialNightMode = readNightMode(false);
const initialState: IGameState = {
  difficulty: initialDifficulty,
  sudoku: {
    past: [],
    current: Sudoku.create(initialDifficulty).activateCell(1, 1),
    future: []
  },
  mode: MODE.Input,
  nightMode: initialNightMode
};

export function gameReducer(state = initialState, action: OptionActions): IGameState {
  switch (action.type) {
    case CHANGE_DIFFICULTY:
      writeDifficulty(action.payload);
      return {
        ...state,
        difficulty: action.payload,
        sudoku: {
          past: [],
          current: Sudoku.create(action.payload).activateCell(1, 1),
          future: []
        }
      };
    case NEW_GAME:
      return {
        ...state,
        sudoku: {
          past: [],
          current: Sudoku.create(state.difficulty),
          future: []
        }
      };
    case VALIDATE_SOLUTION:
      return {
        ...state,
        sudoku: {
          ...state.sudoku,
          current: state.sudoku.current.validate()
        }
      };
    case TOGGLE_CELL:
      return {
        ...state,
        sudoku: {
          ...state.sudoku,
          current: state.sudoku.current.activateCell(action.payload.row, action.payload.column)
        }
      };
    case SET_DIGIT:
      return {
        ...state,
        sudoku: {
          past: [...state.sudoku.past, state.sudoku.current],
          current: state.sudoku.current.setDigit(action.payload.digit, state.mode),
          future: []
        }
      };
    case REMOVE_DIGIT:
      return {
        ...state,
        sudoku: {
          past: [...state.sudoku.past, state.sudoku.current],
          current: state.sudoku.current.removeDigit(),
          future: []
        }
      };
    case NAVIGATE_CELLS:
      return {
        ...state,
        sudoku: {
          ...state.sudoku,
          current: state.sudoku.current.navigate(action.payload.direction)
        }
      };
    case SET_MODE:
      return {
        ...state,
        mode: action.payload.mode
      };
    case UNDO:
      if (!state.sudoku.past.length) {
        return state;
      }
      const previous = state.sudoku.past.slice(-1)[0];
      return {
        ...state,
        sudoku: {
          past: state.sudoku.past.slice(0, -1),
          current: previous,
          future: [...state.sudoku.future, state.sudoku.current]
        }
      }
    case REDO:
      if (!state.sudoku.future.length) {
        return state;
      }
      const next = state.sudoku.future.slice(-1)[0];
      return {
        ...state,
        sudoku: {
          past: [...state.sudoku.past, state.sudoku.current],
          current: next,
          future: state.sudoku.future.slice(0, -1)
        }
      }
    case TOGGLE_NIGHT_MODE:
      const nightMode = !state.nightMode;
      writeNightMode(nightMode);
      return {
        ...state,
        nightMode
      }
    case RESET_SUDOKU:
      return {
        ...state,
        sudoku: {
          past: [],
          current: state.sudoku.past.shift() || state.sudoku.current,
          future: []
        }
      }
    default:
      return state;
  }
}

function readDifficulty(fallBack: DIFFICULTY): DIFFICULTY {
  const data = window.localStorage.getItem('DIFFICULTY');
  if (!data) {
    return fallBack;
  }
  return +data as DIFFICULTY;
}
function writeDifficulty(difficulty: DIFFICULTY) {
  window.localStorage.setItem('DIFFICULTY', difficulty.toString());
}

function readNightMode(fallBack: boolean): boolean {
  const data = window.localStorage.getItem('NIGHT_MODE');
  if (!data) {
    return fallBack;
  }
  return data === 'true';
}
function writeNightMode(nightMode: boolean) {
  window.localStorage.setItem('NIGHT_MODE', nightMode.toString());
}