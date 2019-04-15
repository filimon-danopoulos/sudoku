import Sudoku from "../models/Sudoku";
import { DIFFICULTY } from "../models/Difficulty";

export interface IGameState {
  difficulty: DIFFICULTY;
  sudoku: {
    past: Sudoku[];
    current: Sudoku;
    future: Sudoku[];
  };
  mode: MODE;
  nightMode: boolean;
}

export enum DIRECTION {
  Up,
  Down,
  Left,
  Right
}

export enum MODE {
  Input,
  Note,
  Guess
}

export const CHANGE_DIFFICULTY = "CHANGE_DIFFICULTY";
export const NEW_GAME = "NEW_GAME";
export const VALIDATE_SOLUTION = "VALIDATE_SOLUTION";
export const TOGGLE_CELL = "TOGGLE_CELLs";
export const SET_DIGIT = "SET_DIGIT";
export const REMOVE_DIGIT = "REMOVE_DIGIT";
export const NAVIGATE_CELLS = "NAVIGATE_CELLS";
export const TOGGLE_NOTE_MODE = "TOGGLE_NOTE_MODE";
export const UNDO = "UNDO";
export const REDO = "REDO";
export const TOGGLE_NIGHT_MODE = "TOGGLE_NIGHT_MODE";
export const RESET_SUDOKU = "RESET_SUDOKU";

interface IChangeDifficultyAction {
  type: typeof CHANGE_DIFFICULTY;
  payload: DIFFICULTY;
}

interface INewGameAction {
  type: typeof NEW_GAME;
}

interface IValidateSolutionAction {
  type: typeof VALIDATE_SOLUTION;
}

interface IToggleCellAction {
  type: typeof TOGGLE_CELL;
  payload: {
    row: number;
    column: number;
  }
}

interface ISetDigitAction {
  type: typeof SET_DIGIT;
  payload: {
    digit: number;
  }
}

interface IRemoveDigitAction {
  type: typeof REMOVE_DIGIT;
}

interface INavigateCellsAction {
  type: typeof NAVIGATE_CELLS;
  payload: {
    direction: DIRECTION;
  }
}

interface ISetModeAction {
  type: typeof TOGGLE_NOTE_MODE;
  payload: {
    mode: MODE
  }
}
interface IUndoAction {
  type: typeof UNDO;
}
interface IRedoAction {
  type: typeof REDO;
}
interface IToggleNightModeAction {
  type: typeof TOGGLE_NIGHT_MODE;
}

interface IResetSudokuAction {
  type: typeof RESET_SUDOKU;
}

export type OptionActions = IChangeDifficultyAction
  | INewGameAction
  | IValidateSolutionAction
  | IToggleCellAction
  | ISetDigitAction
  | IRemoveDigitAction
  | INavigateCellsAction
  | ISetModeAction
  | IUndoAction
  | IRedoAction
  | IToggleNightModeAction
  | IResetSudokuAction;