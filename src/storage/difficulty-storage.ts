import { difficulty } from './puzzle-storage';

export const loadDifficulty = (): difficulty => {
  return (localStorage.getItem('difficulty') ?? 'moderate') as difficulty;
};

export const saveDifficulty = (difficulty: difficulty) => {
  return localStorage.setItem('difficulty', difficulty);
};
