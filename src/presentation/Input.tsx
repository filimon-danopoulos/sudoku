import '../layout/Input.scss';

import React from 'react';

import { setDigit, removeDigit, toggleNoteMode, redo, undo } from '../store/actions';

interface InputComponentProps {
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
  noteMode: boolean;
  toggleNoteMode: typeof toggleNoteMode;
  undo: typeof undo;
  redo: typeof redo;
}

export const INPUT_HEIGHT = 100;

const InputComponent: React.FunctionComponent<InputComponentProps> = props => {
  return (
    <div className="Input-container" style={{ height: `${INPUT_HEIGHT}px` }}>
      <div className="Input-numbers">
        {[...Array(10).keys()].slice(1).map(x => <button key={x} onClick={() => props.setDigit(x)}>{x}</button>)}
      </div>
      <div className="Input-utils">
        <button onClick={() => props.undo()}>Undo</button>
        <button className={props.noteMode ? 'active' : ''} onClick={() => props.toggleNoteMode()}>Note</button>
        <button onClick={() => props.removeDigit()}>Clear</button>
        <button onClick={() => props.redo()}>Redo</button>
      </div>
    </div >
  );
}

export default InputComponent;