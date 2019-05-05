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
  TOGGLE_NOTE_MODE,
  UNDO,
  REDO,
  MODE,
  TOGGLE_NIGHT_MODE,
  RESET_SUDOKU,
  FILL_CANDIDATES,
  CLEAR_CANDIDATES,
  TOGGLE_SETTING_USE_NOTES,
  TOGGLE_SETTING_MARK_COMPLETED,
  TOGGLE_SETTING_PROGRESS
} from "./types";
import PuzzleStorage from "../PuzzleStorage"
import Settings from "../models/Settings";


const initialSettings = new Settings();
const initialState: IGameState = {
  sudoku: {
    past: [],
    current: PuzzleStorage.getPuzzle(initialSettings.Difficulty).activateCell(1, 1),
    future: []
  },
  settings: initialSettings
};

export function gameReducer(state = initialState, action: OptionActions): IGameState {
  switch (action.type) {
    case CHANGE_DIFFICULTY:
      return {
        ...state,
        settings: state.settings.setDifficulty(action.payload),
        sudoku: {
          past: [],
          current: PuzzleStorage.getPuzzle(action.payload).activateCell(1, 1),
          future: []
        }
      };
    case NEW_GAME:
      return {
        ...state,
        sudoku: {
          past: [],
          current: PuzzleStorage.getPuzzle(state.settings.Difficulty).activateCell(1, 1),
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
          current: state.sudoku.current.setDigit(action.payload.digit, action.payload.force ? MODE.Input : state.settings.InputMode),
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
    case TOGGLE_NOTE_MODE:
      return {
        ...state,
        settings: state.settings.setInputMode(action.payload.mode)
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
      return {
        ...state,
        settings: state.settings.toggleNightModeEnabled()
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
    case FILL_CANDIDATES:
      return {
        ...state,
        sudoku: {
          past: [...state.sudoku.past, state.sudoku.current],
          current: state.sudoku.current.fillCandidates(),
          future: []
        }
      }
    case CLEAR_CANDIDATES:
      return {
        ...state,
        sudoku: {
          past: [...state.sudoku.past, state.sudoku.current],
          current: state.sudoku.current.clearCandidates(),
          future: []
        }
      }
    case TOGGLE_SETTING_USE_NOTES:
      return {
        ...state,
        sudoku: {
          ...state.sudoku,
          current: state.settings.NotesEnabled ? state.sudoku.current.clearCandidates() : state.sudoku.current
        },
        settings: state.settings.toggleNotesEnabled()
      }
    case TOGGLE_SETTING_MARK_COMPLETED:
      return {
        ...state,
        settings: state.settings.toggleMarkCompletedNumbersEnabled()
      }
    case TOGGLE_SETTING_PROGRESS:
      return {
        ...state,
        settings: state.settings.toggleProgressEnabled()
      }
    default:
      return state;
  }
}
