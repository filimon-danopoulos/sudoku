import '../sudoku-header/sudoku-header.element';
import '../sudoku-menu/sudoku-menu.element';
import '../sudoku-option/sudoku-option.element';
import '../sudoku-board/sudoku-board.element';
import '../sudoku-cell/sudoku-cell.element';
import '../sudoku-input/sudoku-input.element';
import '../sudoku-controls/sudoku-controls.element';

import styles from './sudoku-shell.css' with { type: 'css' };

import resetIcon from '../../icons/reset.svg';
import clearIcon from '../../icons/clear.svg';
import validIcon from '../../icons/valid.svg';
import penIcon from '../../icons/pen.svg';
import fileIcon from '../../icons/file.svg';

import type { SudokuInputElement } from '../sudoku-input/sudoku-input.element';
import { SudokuCelllement } from '../sudoku-cell/sudoku-cell.element';
import { getPuzzle } from '../../puzzles/puzzle-service';

const $template = document.createElement('template');
$template.innerHTML = `
  <sudoku-header>
    <span slot="difficulty">Difficulty</span>
    <sudoku-menu slot="action">
      <sudoku-option class="new">${fileIcon} New Game</sudoku-option>
      <sudoku-option class="reset">${resetIcon} Reset Game</sudoku-option>
      <hr>
      <sudoku-option class="validate">${validIcon} Validate</sudoku-option>
      <sudoku-option class="clear-validation">${clearIcon} Clear Validation</sudoku-option>
      <hr>
      <sudoku-option class="clear-notes">${penIcon} Clear Notes</sudoku-option>
    </sudoku-menu>
  </sudoku-header>
  <div class="content">
    <sudoku-board>
      ${Array.from({ length: 81 }, (_, i) => `<sudoku-cell column="${i % 9}" row="${Math.floor(i / 9)}" ></sudoku-cell>`).join('\n')}
    </sudoku-board>
    <sudoku-input></sudoku-input>
  </div>
  <sudoku-controls></sudoku-controls>
`;

export class SudokuShellElement extends HTMLElement {
  #undoStack = [] as { candidates: string[]; value: string }[][];
  #redoStack = [] as { candidates: string[]; value: string }[][];
  #saveState() {
    const state = this.#getState();
    this.#undoStack.push(state);
    if (this.#redoStack.length) {
      this.#redoStack.length = 0;
    }
  }
  #getState() {
    const state = [] as { candidates: string[]; value: string }[];
    const $cells = this.shadowRoot?.querySelectorAll(
      'sudoku-cell'
    ) as NodeListOf<SudokuCelllement>;
    $cells.forEach(($cell) => {
      state.push({
        candidates: $cell.candidates,
        value: $cell.value,
      });
    });
    return state;
  }

  #applyState(state: { candidates: string[]; value: string }[]) {
    const $cells = this.shadowRoot?.querySelectorAll(
      'sudoku-cell'
    ) as NodeListOf<SudokuCelllement>;
    let index = 0;
    $cells.forEach(($cell) => {
      const { candidates, value } = state[index];
      $cell.value = value;
      $cell.candidates = candidates;
      index++;
    });
  }

  undo() {
    const previousState = this.#undoStack.pop();
    if (previousState) {
      const currentState = this.#getState();
      this.#redoStack.push(currentState);
      this.#applyState(previousState);
    }
  }

  redo() {
    const nextState = this.#redoStack.pop();
    if (nextState) {
      const currentState = this.#getState();
      this.#undoStack.push(currentState);
      this.#applyState(nextState);
    }
  }

  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot?.adoptedStyleSheets.push(styles);
    const $content = document.importNode($template.content, true);
    this.shadowRoot?.appendChild($content);
  }

  loadPuzzle(puzzle: { solution: string; value: string }[]) {
    const $cells = this.shadowRoot?.querySelectorAll(
      'sudoku-cell'
    ) as NodeListOf<SudokuCelllement>;
    $cells.forEach((cell, index) => {
      cell.active = index === 0;
      cell.value = puzzle[index].value.toString();
      cell.solution = puzzle[index].solution.toString();
      cell.given = cell.value === cell.solution;
      cell.addEventListener('cell-activated', (e: Event) => {
        const $target = e.target as SudokuCelllement;
        $cells.forEach(($cell) => {
          if ($cell !== $target) {
            $cell.active = false;
          }
        });
      });
    });
  }

  connectedCallback() {
    const $input =
      this.shadowRoot?.querySelector<SudokuInputElement>('sudoku-input');
    $input?.addEventListener('input-value', (e: Event) => {
      const $cell = this.shadowRoot?.querySelector<SudokuCelllement>(
        'sudoku-cell[active]'
      );
      if ($cell && !$cell.given) {
        this.#saveState();
        $cell.value = (e as CustomEvent).detail;
      }
    });
    $input?.addEventListener('input-candidate', (e: Event) => {
      const $cell = this.shadowRoot?.querySelector<SudokuCelllement>(
        'sudoku-cell[active]'
      );
      if ($cell && !$cell.given) {
        this.#saveState();

        const candidate = (e as CustomEvent).detail;
        if ($cell.candidates.includes(candidate)) {
          $cell.candidates = $cell.candidates.filter((c) => c !== candidate);
        } else {
          $cell.candidates = $cell.candidates.concat([candidate]);
        }
      }
    });

    const $controls =
      this.shadowRoot?.querySelector<SudokuInputElement>('sudoku-controls');
    $controls?.addEventListener('clear', () => {
      const $cell = this.shadowRoot?.querySelector<SudokuCelllement>(
        'sudoku-cell[active]'
      );
      if ($cell) {
        $cell.value = '';
        $cell.candidates = [];
      }
    });

    this.shadowRoot
      ?.querySelector('sudoku-option.new')
      ?.addEventListener('click', () => {
        this.loadPuzzle(getPuzzle());
      });

    const $cells = this.shadowRoot?.querySelectorAll(
      'sudoku-cell'
    ) as NodeListOf<SudokuCelllement>;

    this.shadowRoot
      ?.querySelector('sudoku-option.reset')
      ?.addEventListener('click', () => {
        $cells.forEach(($cell) => {
          if (!$cell.given) {
            $cell.value = '';
            $cell.candidates = [];
          }
        });
      });

    this.shadowRoot
      ?.querySelector('sudoku-option.validate')
      ?.addEventListener('click', () => {
        $cells.forEach(($cell) => {
          if (!$cell.given && $cell.value) {
            $cell.invalid = $cell.value !== $cell.solution;
          }
        });
      });

    this.shadowRoot
      ?.querySelector('sudoku-option.clear-validation')
      ?.addEventListener('click', () => {
        $cells.forEach(($cell) => {
          if (!$cell.given && $cell.value) {
            $cell.invalid = false;
          }
        });
      });

    this.shadowRoot
      ?.querySelector('sudoku-option.clear-notes')
      ?.addEventListener('click', () => {
        this.#saveState();
        $cells.forEach(($cell) => {
          if (!$cell.given) {
            $cell.candidates = [];
          }
        });
      });
  }
}

if (!customElements.get('sudoku-shell')) {
  customElements.define('sudoku-shell', SudokuShellElement);
}
