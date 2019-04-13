import '../layout/Input.scss';

import React from 'react';

import { setDigit, removeDigit, setMode, redo, undo } from '../store/actions';
import Sudoku from '../models/Sudoku';
import { MODE } from '../store/types';

interface InputComponentProps {
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  mode: MODE;
  setMode: typeof setMode;
  undo: typeof undo;
  redo: typeof redo;
  past: Sudoku[];
  future: Sudoku[];
  sudoku: Sudoku;
}

export const INPUT_HEIGHT = 100;

const InputComponent: React.FunctionComponent<InputComponentProps> = props => {
  const toggleMode = (mode: MODE) => {
    if (props.mode === mode) {
      props.setMode(MODE.Input);
    } else {
      props.setMode(mode);
    }
  }

  const getModeClass = (mode: MODE): string => {
    if (props.mode === mode) {
      return 'active';
    }
    return '';
  }

  if (props.sudoku.isSolved()) {
    return null;
  }

  return (
    <div className="Input-container" style={{ height: `${INPUT_HEIGHT}px` }}>
      <div className="Input-numbers">
        {[...Array(10).keys()].slice(1).map(x => (
          <button key={x} onClick={() => props.setDigit(x)} className={props.sudoku.isDigitSolved(x) ? 'solved' : ''}>
            {x}
          </button>
        ))}
      </div>
      <div className="Input-utils">
        <button disabled={!props.past.length} onClick={() => props.undo()}>Undo</button>
        <button className={getModeClass(MODE.Note)} onClick={() => toggleMode(MODE.Note)}>Note</button>
        <button onClick={() => props.removeDigit()}>Clear</button>
        <button className={getModeClass(MODE.Guess)} onClick={() => toggleMode(MODE.Guess)}>Guess</button>
        <button disabled={!props.future.length} onClick={() => props.redo()}>Redo</button>
      </div>
    </div >
  );
}

export default InputComponent;