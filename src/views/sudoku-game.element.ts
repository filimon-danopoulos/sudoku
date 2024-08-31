import '../components/sudoku-shell/sudoku-shell.element';
import '../components/sudoku-menu/sudoku-menu.element';
import '../components/sudoku-option/sudoku-option.element';
import '../components/sudoku-board/sudoku-board.element';
import '../components/sudoku-cell/sudoku-cell.element';
import '../components/sudoku-input/sudoku-input.element';
import '../components/sudoku-icon/sudoku-icon.element';

import style from './sudoku-game.css' with { type: 'css' };

import type { puzzleCell } from '../puzzles/puzzle-service';

import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('sudoku-game-view')
export class SudokuGameViewElement extends LitElement {
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
      <sudoku-shell>
        <span slot="header-title">Difficulty</span>
        <sudoku-menu slot="header-actions">
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
          <sudoku-option @click=${this.#clearValidation}>
            <sudoku-icon icon="clear"></sudoku-icon>
            Clear Validation
          </sudoku-option>
          <hr />
          <sudoku-option @click=${this.#clearCandidates}>
            <sudoku-icon icon="pen"></sudoku-icon>
            Clear Notes
          </sudoku-option>
        </sudoku-menu>
        <div class="content" slot="content">
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

        <sudoku-button slot="footer-start" @click=${this.#undo} ?disabled=${!this._undoStack.length}>
          <sudoku-icon icon="undo"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="footer-middle" @click=${this.#clearActiveCell}>
          <sudoku-icon icon="clear"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="footer-end" @click=${this.#redo} ?disabled=${!this._redoStack.length}>
          <sudoku-icon icon="redo"></sudoku-icon>
        </sudoku-button>
      </sudoku-shell>
    `;
  }

  protected firstUpdated(): void {
    document.addEventListener('keydown', this.#handleKeyboard, { capture: true });
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

  #clearValidation = () => {
    this.puzzle = this.puzzle.map((cell) => {
      if (!cell.given && cell.value) {
        const newCell = structuredClone(cell);
        newCell.invalid = false;
        return newCell;
      }
      return cell;
    });
  };

  #handleKeyboard = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
        this._activeIndex = this._activeIndex < 9 ? this._activeIndex + 72 : this._activeIndex - 9;
        break;
      case 'ArrowDown':
        this._activeIndex = this._activeIndex > 71 ? this._activeIndex % 9 : this._activeIndex + 9;
        break;
      case 'ArrowRight':
        this._activeIndex = this._activeIndex === 80 ? 0 : this._activeIndex + 1;
        break;
      case 'ArrowLeft':
        this._activeIndex = this._activeIndex === 0 ? 80 : this._activeIndex - 1;
        break;
      case 'Backspace':
        this.#clearActiveCell();
        break;
      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
      case 'Digit5':
      case 'Digit6':
      case 'Digit7':
      case 'Digit8':
      case 'Digit9': {
        const number = e.code.replace('Digit', '');
        if (e.shiftKey) {
          this.#inputCandidate(new CustomEvent('temp', { detail: number }));
        } else {
          this.#inputValue(new CustomEvent('temp', { detail: number }));
        }
        break;
      }
      case 'KeyZ':
        if (e.ctrlKey && !e.shiftKey) {
          this.#undo();
        } else if (e.ctrlKey && e.shiftKey) {
          this.#redo();
        }
    }
  };
}
