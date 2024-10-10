import '../../elements/sudoku-shell/sudoku-shell.element';
import '../../elements/sudoku-menu/sudoku-menu.element';
import '../../elements/sudoku-option/sudoku-option.element';
import '../../elements/sudoku-board/sudoku-board.element';
import '../../elements/sudoku-cell/sudoku-cell.element';
import '../../elements/sudoku-input/sudoku-input.element';
import '../../elements/sudoku-icon/sudoku-icon.element';

import style from './sudoku-game.css' with { type: 'css' };

import type { puzzleCell } from '../../app/types';

import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { difficultyContext } from '../../elements/sudoku-context/difficulty-context';
import { difficulty, loadCurrentPuzzle, saveCurrentPuzzle } from '../../storage/puzzle-storage';
import { consume } from '@lit/context';
import { Sudoku } from '../../sudoku/model/Sudoku';
import { SudokuCell } from '../../sudoku/model/SudokuCell';
import {
  defaultSettings,
  settings,
  settingsContext,
} from '../../elements/sudoku-context/settings-context';

@customElement('sudoku-game-view')
export class SudokuGameView extends LitElement {
  static styles = [style];

  @consume({ context: difficultyContext, subscribe: true })
  private _difficulty: difficulty = 'moderate';

  @consume({ context: settingsContext, subscribe: true })
  private _settings: settings = defaultSettings;

  @property({ attribute: 'sudoku', type: String })
  accessor sudoku = '' as string;

  @state()
  private accessor _cells = [] as puzzleCell[];

  @state()
  private accessor _activeIndex = 0;

  @state()
  private accessor _undoStack = [] as { candidates: string[]; value: string }[][];

  @state()
  private accessor _redoStack = [] as { candidates: string[]; value: string }[][];

  @state()
  private accessor _progress = 0;

  @state()
  private accessor _completed = [] as string[];

  @state()
  private accessor _solved = false;

  @state()
  private accessor _highlights = [] as string[];

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('sudoku')) {
      if (this.sudoku.length) {
        const ongoing = loadCurrentPuzzle();
        const savedCells = ongoing.puzzle === this.sudoku ? ongoing.cells : null;
        this._cells =
          savedCells ??
          this.sudoku.split('').map((cell) => ({
            given: cell !== '0',
            value: cell.replace('0', ''),
            candidates: [],
            invalid: false,
          }));
      }
    }

    if (changed.has('_cells') || changed.has('sudoku')) {
      const suppliedValues = this._cells.filter((c) => !c.given && c.value).length;
      const valuesToSupply = this.sudoku.split('').filter((c) => c === '0').length;
      this._progress = suppliedValues / valuesToSupply;
      this._completed = Array.from({ length: 9 }, (_, x) => {
        const value = (x + 1).toString();
        const count = this._cells.filter((c) => c.value === value).length;
        if (count === 9) {
          return value;
        }
        return '';
      }).filter((x) => !!x);
    }

    if (changed.has('_cells')) {
      this._solved = false;
      saveCurrentPuzzle(this.sudoku, this._cells, this._difficulty);
    }
  }

  render() {
    return html`
      <sudoku-shell view="game">
        <span slot="header-title" class="difficulty">${this._difficulty}</span>
        <sudoku-menu slot="header-actions">
          <sudoku-option class="new" href="#/new">
            <sudoku-icon icon="file"></sudoku-icon>
            New Game
          </sudoku-option>
          <sudoku-option @click=${this.#resetPuzzle}>
            <sudoku-icon icon="reset"></sudoku-icon>
            Reset Game
          </sudoku-option>
          <hr />
          <sudoku-option @click=${this.#validate} ?disabled=${this._progress !== 1}>
            <sudoku-icon icon="valid"></sudoku-icon>
            Validate
          </sudoku-option>

          <sudoku-option href="#/solver">
            <sudoku-icon icon="question"></sudoku-icon>
            Open In Solver
          </sudoku-option>
          <hr />
          <sudoku-option @click=${this.#addCandidates}>
            <sudoku-icon icon="pen"></sudoku-icon>
            Add Notes
          </sudoku-option>
          <sudoku-option @click=${this.#clearCandidates}>
            <sudoku-icon icon="clear"></sudoku-icon>
            Clear Notes
          </sudoku-option>
        </sudoku-menu>
        <div class="content" slot="content">
          <sudoku-board>
            ${this._cells.map(
              (cell, i) =>
                html`<sudoku-cell
                  ?active=${i === this._activeIndex}
                  ?given=${cell.given}
                  ?invalid=${cell.invalid}
                  .highlights=${this._highlights}
                  .candidates=${cell.candidates}
                  value=${cell.value ?? ''}
                  column=${i % 9}
                  row=${Math.floor(i / 9)}
                  @pointerdown=${() => this.#handleCellClickStart(cell)}
                  @pointerup=${() => {
                    this.#handleCellClickEnd(i);
                  }}
                  style=${this._solved ? 'background-color: rgba(120, 190, 120, 0.5)' : ''}
                ></sudoku-cell>`
            )}
          </sudoku-board>
          <sudoku-input
            @input-value=${(e: CustomEvent) => this.#inputValue(e.detail as string)}
            @input-candidate=${(e: CustomEvent) => this.#inputCandidate(e.detail as string)}
            progress=${this._progress}
            .completed=${this._completed}
          ></sudoku-input>
        </div>

        <sudoku-button
          slot="footer-start"
          @click=${this.#undo}
          ?disabled=${!this._undoStack.length}
        >
          <sudoku-icon icon="undo"></sudoku-icon>
        </sudoku-button>
        <sudoku-button
          slot="footer-middle"
          @click=${this.#clearActiveCell}
          ?disabled=${this.#clearButtonDisabled}
        >
          <sudoku-icon icon="clear"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="footer-end" @click=${this.#redo} ?disabled=${!this._redoStack.length}>
          <sudoku-icon icon="redo"></sudoku-icon>
        </sudoku-button>
      </sudoku-shell>
    `;
  }

  #addHighlightTimeout?: ReturnType<typeof setTimeout>;
  #isolateHighlightTimeout?: ReturnType<typeof setTimeout>;

  #handleCellClickStart(cell: puzzleCell) {
    this.#addHighlightTimeout = setTimeout(() => {
      if (cell.value && !this._highlights.includes(cell.value)) {
        this._highlights = this._settings.highlights.multiple
          ? [...this._highlights, cell.value]
          : [cell.value];
      } else if (!cell.value) {
        this._highlights = [];
      }
      this.#addHighlightTimeout = undefined;
      if (this._settings.highlights.multiple) {
        this.#isolateHighlightTimeout = setTimeout(() => {
          this._highlights = [cell.value];
          this.#isolateHighlightTimeout = undefined;
        }, 500);
      }
    }, 250);
  }

  #handleCellClickEnd(index: number) {
    if (this.#addHighlightTimeout) {
      clearTimeout(this.#addHighlightTimeout);
    }
    if (this.#isolateHighlightTimeout) {
      clearTimeout(this.#isolateHighlightTimeout);
    }
    this._activeIndex = index;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.#handleKeyboard, { capture: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#handleKeyboard, { capture: true });
  }

  #saveState() {
    const state = this.#getState();
    this._undoStack = [...this._undoStack, state];
    if (this._redoStack.length) {
      this._redoStack = [];
    }
  }

  #getState() {
    return this._cells.map((cell) => ({
      candidates: [...cell.candidates],
      value: cell.value,
    }));
  }

  #applyState(state: { candidates: string[]; value: string }[]) {
    this._cells = this._cells.map((cell, i) => ({
      ...cell,
      candidates: cell.given ? cell.candidates : state[i].candidates,
      value: cell.given ? cell.value : state[i].value,
    }));
  }

  get #clearButtonDisabled() {
    const active = this._cells[this._activeIndex];

    return !!active && (active.given || (!active.value && !active.candidates.length));
  }

  #resetPuzzle() {
    this._cells = this._cells.map((cell) => ({
      ...cell,
      candidates: cell.given ? cell.candidates : [],
      value: cell.given ? cell.value : '',
    }));
    this._activeIndex = 0;
    this._undoStack = [];
    this._redoStack = [];
    this._progress = 0;
    this._completed = [];
    this._solved = false;
    this._highlights = [];
  }

  #inputValue(value: string) {
    this._cells = this._cells.map((cell, i) => {
      if (i === this._activeIndex && !cell.given) {
        const newCell = structuredClone(cell);
        this.#saveState();
        newCell.value = value;
        if (value && newCell.candidates.length) {
          newCell.candidates = [];
        }
        return newCell;
      }
      return cell;
    });
  }

  #inputCandidate(candidate: string) {
    this._cells = this._cells.map((cell, i) => {
      if (i === this._activeIndex && !cell.given) {
        const newCell = structuredClone(cell);
        this.#saveState();

        if (newCell.candidates.includes(candidate)) {
          newCell.candidates = cell.candidates.filter((c) => c !== candidate);
        } else {
          newCell.candidates = [...cell.candidates, candidate];
        }

        if (candidate && cell.value) {
          newCell.value = '';
        }

        return newCell;
      }
      return cell;
    });
  }

  #addCandidates() {
    this.#saveState();
    const sudoku = new Sudoku(this._cells.map((c) => c.value || 0).join(''));
    this._cells = this._cells.map((cell, i) => {
      if (!cell.given) {
        const newCell = structuredClone(cell);
        newCell.candidates = sudoku.cells[i].candidates.map((c) => c.toString());
        return newCell;
      }
      return cell;
    });
  }

  #clearCandidates() {
    this.#saveState();
    this._cells = this._cells.map((cell) => {
      if (!cell.given) {
        const newCell = structuredClone(cell);
        newCell.candidates = [];
        return newCell;
      }
      return cell;
    });
  }

  #undo() {
    const previousState = this._undoStack.pop();
    if (previousState) {
      const currentState = this.#getState();
      this._redoStack.push(currentState);
      this.#applyState(previousState);
    }
  }

  #redo() {
    const nextState = this._redoStack.pop();
    if (nextState) {
      const currentState = this.#getState();
      this._undoStack.push(currentState);
      this.#applyState(nextState);
    }
  }

  #clearActiveCell() {
    this._cells = this._cells.map((cell, i) => {
      if (i === this._activeIndex && !cell.given) {
        this.#saveState();
        const newCell = structuredClone(cell);
        newCell.candidates = [];
        newCell.value = '';
        return newCell;
      }
      return cell;
    });
  }

  #validate() {
    const sudoku = new Sudoku(this._cells.map((c) => c.value ?? '0').join(''));
    const invalidCells = new Set<SudokuCell>();
    for (const set of [...sudoku.blocks, ...sudoku.columns, ...sudoku.rows]) {
      for (let value = 1; value <= 9; value++) {
        const cells = set.cells.filter((c) => c.value === value);
        if (cells.length > 1) {
          for (const cell of cells) {
            invalidCells.add(cell);
          }
        }
      }
    }
    const invalidIndeces = sudoku.cells
      .map((cell, index) => (invalidCells.has(cell) ? index : -1))
      .filter((i) => i !== -1);
    if (invalidIndeces.length) {
      this._cells = this._cells.map((cell, index) => {
        const newCell = structuredClone(cell);
        newCell.invalid = invalidIndeces.includes(index);
        return newCell;
      });
    } else {
      this._solved = true;
      this._activeIndex = -1;
    }
  }

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
          this.#inputCandidate(number);
        } else {
          this.#inputValue(number);
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
