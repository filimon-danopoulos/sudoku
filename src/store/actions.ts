import {
  OptionActions,
  CHANGE_DIFFICULTY,
  NEW_GAME,
  VALIDATE_SOLUTION,
  TOGGLE_CELL,
  SET_DIGIT,
  REMOVE_DIGIT,
  NAVIGATE_CELLS,
  DIRECTION,
  TOGGLE_NOTE_MODE,
  REDO,
  UNDO,
  MODE
} from "./types";
import { DIFFICULTY } from "../models/Difficulty";

export function changeDifficulty(difficulty: DIFFICULTY): OptionActions {
  return {
    type: CHANGE_DIFFICULTY,
    payload: difficulty
  };
}

export function createNewGame(): OptionActions {
  return {
    type: NEW_GAME
  };
}

export function validateSolution(): OptionActions {
  return {
    type: VALIDATE_SOLUTION
  };
}

export function toggleCell(row: number, column: number): OptionActions {
  return {
    type: TOGGLE_CELL,
    payload: {
      row,
      column
    }
  };
}

export function setDigit(digit: number): OptionActions {
  return {
    type: SET_DIGIT,
    payload: {
      digit
    }
  };
}

export function removeDigit(): OptionActions {
  return {
    type: REMOVE_DIGIT
  };
}

export function navigateCells(direction: DIRECTION): OptionActions {
  return {
    type: NAVIGATE_CELLS,
    payload: {
      direction
    }
  };
}

export function setMode(mode: MODE): OptionActions {
  return {
    type: TOGGLE_NOTE_MODE,
    payload: {
      mode
    }
  }
}

export function undo(): OptionActions {
  return {
    type: UNDO,
  };
}

export function redo(): OptionActions {
  return {
    type: REDO
  };
}