import '../sudoku-header/sudoku-header.element';
import '../sudoku-menu/sudoku-menu.element';
import '../sudoku-option/sudoku-option.element';
import '../sudoku-board/sudoku-board.element';
import '../sudoku-cell/sudoku-cell.element';
import '../sudoku-input/sudoku-input.element';
import '../sudoku-icon/sudoku-icon.element';
import '../sudoku-controls/sudoku-controls.element';

import style from './sudoku-shell.css' with { type: 'css' };

import type { puzzleCell } from '../../puzzles/puzzle-service';

import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('sudoku-shell')
export class SudokuShellElement extends LitElement {
  static styles = [style];

  @property({ attribute: 'puzzle', type: Array })
  accessor puzzle = [] as puzzleCell[];

  @state()
  private accessor _activeIndex = 0;

  @state()
  private accessor _undoStack = [] as { candidates: string[]; value: string }[][];

  @state()
  private accessor _redoStack = [] as { candidates: string[]; value: string }[][];

  #saveState() {
    const state = this.#getState();
    this._undoStack = [...this._undoStack, state];
    if (this._redoStack.length) {
      this._redoStack = [];
    }
  }

  #getState() {
    return this.puzzle.map((cell) => ({
      candidates: [...cell.candidates],
      value: cell.value,
    }));
  }

  #applyState(state: { candidates: string[]; value: string }[]) {
    this.puzzle = this.puzzle.map((cell, i) => ({
      ...cell,
      candidates: cell.given ? cell.candidates : state[i].candidates,
      value: cell.given ? cell.value : state[i].value,
    }));
  }

  render() {
    return html`
      <sudoku-header>
        <span slot="difficulty">Difficulty</span>
        <sudoku-menu slot="action">
          <sudoku-option class="new">
            <sudoku-icon icon="file"></sudoku-icon>
            New Game
          </sudoku-option>
          <sudoku-option @click=${this.#resetPuzzle}>
            <sudoku-icon icon="reset"></sudoku-icon>
            Reset Game
          </sudoku-option>
          <hr />
          <sudoku-option @click=${this.#validate}>
            <sudoku-icon icon="valid"></sudoku-icon>
            Validate
          </sudoku-option>
          <sudoku-option class="clear-validation">
            <sudoku-icon icon="clear"></sudoku-icon>
            Clear Validation
          </sudoku-option>
          <hr />
          <sudoku-option @click=${this.#clearCandidates}>
            <sudoku-icon icon="pen"></sudoku-icon>
            Clear Notes
          </sudoku-option>
        </sudoku-menu>
      </sudoku-header>
      <div class="content">
        <sudoku-board>
          ${this.puzzle.map(
            (cell, i) =>
              html`<sudoku-cell
                ?active=${i === this._activeIndex}
                ?given=${cell.given}
                ?invalid=${cell.invalid}
                .candidates=${cell.candidates}
                value=${cell.value ?? ''}
                solution=${cell.solution ?? ''}
                column=${i % 9}
                row=${Math.floor(i / 9)}
                @click=${() => (this._activeIndex = i)}
              ></sudoku-cell>`
          )}
        </sudoku-board>
        <sudoku-input @input-value=${this.#inputValue} @input-candidate=${this.#inputCandidate}></sudoku-input>
      </div>
      <sudoku-controls>
        <sudoku-button slot="start" @click=${this.#undo} ?disabled=${!this._undoStack.length}>
          <sudoku-icon icon="undo"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="middle" @click=${this.#clearActiveCell}>
          <sudoku-icon icon="clear"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="end" @click=${this.#redo} ?disabled=${!this._redoStack.length}>
          <sudoku-icon icon="redo"></sudoku-icon>
        </sudoku-button>
      </sudoku-controls>
    `;
  }

  #resetPuzzle = () => {
    this.puzzle = this.puzzle.map((cell) => ({
      ...cell,
      candidates: cell.given ? cell.candidates : [],
      value: cell.given ? cell.value : '',
    }));
  };

  #inputValue = (e: CustomEvent & { detail: string }) => {
    this.puzzle = this.puzzle.map((cell, i) => {
      if (i === this._activeIndex && !cell.given) {
        const newCell = structuredClone(cell);
        this.#saveState();
        newCell.value = e.detail;
        if (e.detail && newCell.candidates.length) {
          newCell.candidates = [];
        }
        return newCell;
      }
      return cell;
    });
  };

  #inputCandidate = (e: CustomEvent & { detail: string }) => {
    this.puzzle = this.puzzle.map((cell, i) => {
      if (i === this._activeIndex && !cell.given) {
        const newCell = structuredClone(cell);
        this.#saveState();

        const candidate = (e as CustomEvent).detail;
        if (newCell.candidates.includes(candidate)) {
          newCell.candidates = cell.candidates.filter((c) => c !== candidate);
        } else {
          newCell.candidates = [...cell.candidates, candidate];
        }

        if (e.detail && cell.value) {
          newCell.value = '';
        }

        return newCell;
      }
      return cell;
    });
  };

  #clearCandidates = () => {
    this.#saveState();
    this.puzzle = this.puzzle.map((cell) => {
      if (!cell.given) {
        const newCell = structuredClone(cell);
        newCell.candidates = [];
        return newCell;
      }
      return cell;
    });
  };

  #undo = () => {
    const previousState = this._undoStack.pop();
    if (previousState) {
      const currentState = this.#getState();
      this._redoStack.push(currentState);
      this.#applyState(previousState);
    }
  };

  #redo = () => {
    const nextState = this._redoStack.pop();
    if (nextState) {
      const currentState = this.#getState();
      this._undoStack.push(currentState);
      this.#applyState(nextState);
    }
  };

  #clearActiveCell = () => {
    this.puzzle = this.puzzle.map((cell, i) => {
      if (i === this._activeIndex && !cell.given) {
        this.#saveState();
        const newCell = structuredClone(cell);
        newCell.candidates = [];
        newCell.value = '';
        return newCell;
      }
      return cell;
    });
  };

  #validate = () => {
    this.puzzle = this.puzzle.map((cell) => {
      if (!cell.given && cell.value) {
        const newCell = structuredClone(cell);
        newCell.invalid = cell.solution !== cell.value;
        return newCell;
      }
      return cell;
    });
  };
}
