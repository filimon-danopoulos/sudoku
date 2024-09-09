import { createContext } from '@lit/context';
import { difficulty } from '../../storage/puzzle-storage';

export const difficultyContext = createContext<difficulty>(Symbol('difficulty-context'));
