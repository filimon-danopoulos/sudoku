import React from "react";
import { changeDifficulty } from "../store/actions";
import { DIFFICULTY } from "../models/Difficulty";

export interface IDifficultySelectorProps {
  changeDifficulty: typeof changeDifficulty;
  difficulty: DIFFICULTY;
}

const options = [
  {
    label: "Very Easy",
    value: DIFFICULTY.VeryEasy
  },
  {
    label: "Easy",
    value: DIFFICULTY.Easy
  },
  {
    label: "Normal",
    value: DIFFICULTY.Normal
  },
  {
    label: "Hard",
    value: DIFFICULTY.Hard
  },
  {
    label: "Very Hard",
    value: DIFFICULTY.VeryHard
  }
];

const DifficultySelectorComponent: React.FunctionComponent<IDifficultySelectorProps> = props => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = +e.target.value as DIFFICULTY;
    props.changeDifficulty(value);
  };

  return (
    <select className="Options-difficulty" value={props.difficulty} onChange={handleChange}>
      {options.map(x => (
        <option value={x.value} key={x.value}>
          {x.label}
        </option>
      ))}
    </select>
  );
};

export default DifficultySelectorComponent;
