import "../layout/Options.scss";
import React from "react";
import { createNewGame, validateSolution } from "../store/actions";
import DifficultySelector, { IDifficultySelectorProps } from "./DifficultySelector";

export interface INewGameButtonProps {
  createNewGame: typeof createNewGame;
}

export interface IOptionsProps extends IDifficultySelectorProps {
  validateSolution: typeof validateSolution;
  createNewGame: typeof createNewGame;
}

const OptionsComponent: React.FunctionComponent<IOptionsProps> = props => {
  return (
    <div className="Options-container">
      <button className="Options-new" onClick={props.createNewGame}>New Game</button>
      <button className="Options-validate" onClick={props.validateSolution}>Validate</button>
      <DifficultySelector {...props} />
    </div>
  );
};


export default OptionsComponent;
