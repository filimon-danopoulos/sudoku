import React from 'react';

import { setDigit, removeDigit, setMode, redo, undo } from '../store/actions';
import Sudoku from '../models/Sudoku';
import { MODE } from '../store/types';
import { Chip, Paper } from '@material-ui/core';

interface InputComponentProps {
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  mode: MODE;
  setMode: typeof setMode;
  sudoku: Sudoku;
}

export const INPUT_HEIGHT = 100;

const InputComponent: React.FunctionComponent<InputComponentProps> = props => {
  if (props.sudoku.isSolved()) {
    return null;
  }

  return (
    <div className="Input-container" style={{ width: '100%', paddingTop: '15px' }}>
      <Paper>
        <div className="Input-numbers">
          {[...Array(10).keys()].slice(1).map(x => (
            <Chip color="primary" label={x} key={x} onClick={() => props.setDigit(x)} style={{ margin: '4px 2px 4px 2px' }} />
          ))}
        </div>
      </Paper>
    </div >
  );
}

export default InputComponent;