import '../../components/sudoku-shell/sudoku-shell.element';
import '../../components/sudoku-menu/sudoku-menu.element';
import '../../components/sudoku-option/sudoku-option.element';
import '../../components/sudoku-board/sudoku-board.element';
import '../../components/sudoku-cell/sudoku-cell.element';
import '../../components/sudoku-input/sudoku-input.element';
import '../../components/sudoku-icon/sudoku-icon.element';

import style from './sudoku-game.css' with { type: 'css' };

import type { puzzleCell } from '../../storage/puzzle-service';

import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { difficultyContext } from '../../components/sudoku-context/difficulty-context';
import { difficulty } from '../../storage/puzzle-storage';
import { consume } from '@lit/context';

@customElement('sudoku-game-view')
export class SudokuGameView extends LitElement {
  static styles = [style];

  @consume({ context: difficultyContext, subscribe: true })
  private _difficulty: difficulty = 'moderate';

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

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('sudoku')) {
      if (this.sudoku.length) {
        const ongoing = JSON.parse(localStorage.getItem('ongoing') ?? '{}');
        this._cells =
          ongoing[this.sudoku] ??
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
    }

    if (changed.has('_cells')) {
      localStorage.setItem(
        'ongoing',
        JSON.stringify(
          Object.assign(JSON.parse(localStorage.getItem('ongoing') ?? '{}'), {
            [this.sudoku]: this._cells,
          })
        )
      );
    }
  }

  render() {
    return html`
      <sudoku-shell view="game">
        <span slot="header-title" class="difficulty">${this._difficulty}</span>
        <sudoku-menu slot="header-actions">
          <sudoku-option class="new" href="#/sudoku/new">
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

          <sudoku-option @click=${this.#openSolver}>
            <sudoku-icon icon="question"></sudoku-icon>
            Open In Solver
          </sudoku-option>
          <hr />
          <sudoku-option @click=${this.#clearCandidates}>
            <sudoku-icon icon="pen"></sudoku-icon>
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
                  .candidates=${cell.candidates}
                  value=${cell.value ?? ''}
                  column=${i % 9}
                  row=${Math.floor(i / 9)}
                  @click=${() => (this._activeIndex = i)}
                ></sudoku-cell>`
            )}
          </sudoku-board>
          <sudoku-input
            @input-value=${(e: CustomEvent) => this.#inputValue(e.detail as string)}
            @input-candidate=${(e: CustomEvent) => this.#inputCandidate(e.detail as string)}
            progress=${this._progress}
          ></sudoku-input>
        </div>

        <sudoku-button slot="footer-start" @click=${this.#undo} ?disabled=${!this._undoStack.length}>
          <sudoku-icon icon="undo"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="footer-middle" @click=${this.#clearActiveCell} ?disabled=${this.#clearButtonDisabled}>
          <sudoku-icon icon="clear"></sudoku-icon>
        </sudoku-button>
        <sudoku-button slot="footer-end" @click=${this.#redo} ?disabled=${!this._redoStack.length}>
          <sudoku-icon icon="redo"></sudoku-icon>
        </sudoku-button>
      </sudoku-shell>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.#handleKeyboard, { capture: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#handleKeyboard, { capture: true });
  }

  #openSolver() {
    window.location.hash = `#solver/${this._cells.reduce((result, cell) => (result += cell.value || '0'), '')}`;
  }

  get #clearButtonDisabled() {
    const active = this._cells[this._activeIndex];
    return active.given || (!active.value && !active.candidates.length);
  }

  #resetPuzzle = () => {
    this._cells = this._cells.map((cell) => ({
      ...cell,
      candidates: cell.given ? cell.candidates : [],
      value: cell.given ? cell.value : '',
    }));
    const previous = JSON.parse(localStorage.getItem('ongoing') ?? '{}');
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete previous[this.sudoku];
    localStorage.setItem('ongoing', JSON.stringify(previous));
  };

  #inputValue = (value: string) => {
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
  };

  #inputCandidate = (candidate: string) => {
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
  };

  #clearCandidates = () => {
    this.#saveState();
    this._cells = this._cells.map((cell) => {
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
  };

  #validate = () => {
    // this._cells = this._cells.map((cell) => {
    //   if (!cell.given && cell.value) {
    //     const newCell = structuredClone(cell);
    //     newCell.invalid = cell.solution !== cell.value;
    //     return newCell;
    //   }
    //   return cell;
    // });
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
