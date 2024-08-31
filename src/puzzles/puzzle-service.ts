const puzzles = [
  '0.8,0.5,7,6,4,0.9,3,0.2,0.1,0.6,0.3,1,0.2,0.5,7,0.8,0.9,0.4,9,4,2,3,0.1,0.8,0.7,0.6,0.5,3,0.6,8,5,0.9,2,1,4,0.7,5,0.2,0.9,0.4,0.7,0.1,6,0.8,3,0.7,1,0.4,8,0.3,6,0.2,0.5,9,2,0.9,0.3,1,8,0.5,4,0.7,0.6,0.4,0.7,0.6,9,0.2,0.3,0.5,0.1,0.8,0.1,0.8,0.5,0.7,6,4,0.9,0.3,2',
  // '0.3,1,0.6,0.5,0.7,0.2,9,8,4,4,0.2,0.9,1,0.8,0.3,0.6,0.7,5,0.5,0.7,0.8,0.4,9,6,0.2,0.3,0.1,0.2,9,0.5,0.7,0.1,4,8,0.6,0.3,0.1,0.4,7,0.3,6,8,0.5,2,0.9,0.6,0.8,3,9,2,0.5,4,0.1,7,7,0.6,0.4,2,0.3,9,0.1,5,0.8,8,0.5,0.1,0.6,4,0.7,3,0.9,0.2,9,3,0.2,0.8,0.5,1,0.7,0.4,0.6',
  // '0.5,0.8,7,0.6,0.4,0.9,0.3,2,0.1,0.3,6,0.1,0.2,5,7,0.8,0.9,0.4,4,0.9,0.2,3,0.1,8,0.7,0.6,0.5,6,0.3,8,0.5,9,0.2,0.1,0.4,0.7,0.1,7,0.4,8,0.3,0.6,2,5,0.9,0.2,5,9,0.4,0.7,0.1,6,8,3,0.9,0.2,0.3,0.1,8,5,0.4,7,0.6,8,0.1,0.5,0.7,6,4,9,0.3,0.2,0.7,0.4,0.6,0.9,2,3,0.5,0.1,0.8',
  // '0.4,0.2,9,0.1,0.8,3,0.6,5,0.7,0.5,7,0.8,0.4,0.9,0.6,0.2,1,3,3,0.1,6,0.5,7,0.2,0.9,0.4,0.8,0.6,0.8,0.3,9,0.2,0.5,4,7,0.1,0.1,0.4,7,0.3,6,0.8,5,0.9,0.2,2,0.9,0.5,0.7,0.1,4,0.8,3,6,0.9,0.3,0.2,8,5,0.1,7,6,0.4,8,5,0.1,6,0.4,7,3,2,0.9,0.7,6,0.4,0.2,0.3,9,0.1,0.8,0.5',
];

export type puzzleCell = {
  solution: string;
  given: boolean;
  value: string;
  candidates: string[];
  invalid: boolean;
};

export function getPuzzle(): puzzleCell[] {
  return puzzles[Math.floor(Math.random() * puzzles.length)].split(',').map((valueString) => {
    const valueNumber = +valueString;
    if (valueNumber < 1) {
      return {
        solution: (valueNumber * 10).toString(),
        given: false,
        value: '',
        candidates: [],
        invalid: false,
      };
    } else {
      return {
        solution: valueString,
        given: true,
        value: valueString,
        candidates: [],
        invalid: false,
      };
    }
  });
}
