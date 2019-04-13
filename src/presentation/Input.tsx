import '../layout/Input.scss';

import React from 'react';

import { setDigit, removeDigit } from '../store/actions';

interface InputComponentProps {
  setDigit: typeof setDigit;
  removeDigit: typeof removeDigit;
}

export const INPUT_HEIGHT = 100;

const InputComponent: React.FunctionComponent<InputComponentProps> = props => {
  return (
    <div className="Input-container" style={{ height: `${INPUT_HEIGHT}px` }}>
      <div className="Input-numbers">
        {[...Array(10).keys()].slice(1).map(x => <button key={x} onClick={() => props.setDigit(x)}>{x}</button>)}
      </div>
      <div className="Input-utils">
        <button onClick={() => props.removeDigit()}>Clear</button>
      </div>
    </div>
  );
}

export default InputComponent;