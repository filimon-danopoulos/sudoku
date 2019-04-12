import Sudoku from "../models/Sudoku";
import { DIFFICULTY } from "../models/Difficulty";

export interface ISudokuState {
  difficulty: DIFFICULTY;
  sudoku: Sudoku;
}

export enum DIRECTION {
  Up,
  Down,
  Left,
  Right
}

export const CHANGE_DIFFICULTY = "CHANGE_DIFFICULTY";
export const NEW_GAME = "NEW_GAME";
export const VALIDATE_SOLUTION = "VALIDATE_SOLUTION";
export const TOGGLE_CELL = "TOGGLE_CELLs";
export const SET_DIGIT = "SET_DIGIT";
export const REMOVE_DIGIT = "REMOVE_DIGIT";
export const NAVIGATE_CELLS = "NAVIGATE_CELLS";

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

export type OptionActions = IChangeDifficultyAction
  | INewGameAction
  | IValidateSolutionAction
  | IToggleCellAction
  | ISetDigitAction
  | IRemoveDigitAction
  | INavigateCellsAction;