import '../../components/sudoku-shell/sudoku-shell.element';
import '../../components/sudoku-menu/sudoku-menu.element';
import '../../components/sudoku-option/sudoku-option.element';
import '../../components/sudoku-board/sudoku-board.element';
import '../../components/sudoku-cell/sudoku-cell.element';
import '../../components/sudoku-input/sudoku-input.element';
import '../../components/sudoku-icon/sudoku-icon.element';

import style from './sudoku-solver.css' with { type: 'css' };

import { html, LitElement, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Grader } from '../../sudoku/grader/Grader';
import { Sudoku } from '../../sudoku/model/Sudoku';

@customElement('sudoku-solver-view')
export class SudokuSolverViewElement extends LitElement {
  static styles = [style];

  @state()
  private accessor _puzzle = '';

  @state()
  private accessor _currentStep = 0;

  @state()
  private accessor _steps = [] as { description: string; snapshot: { value: string; candidates: string[] }[] }[];

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('_puzzle') && this._puzzle.length === 81) {
      const sudoku = new Sudoku(this._puzzle);
      const grader = new Grader();
      const { steps } = grader.grade(sudoku);
      this._steps = steps;
    }
  }

  render() {
    return html`
      <sudoku-shell view="solver">
        <span slot="header-title">Solver</span>
        <div class="content" slot="content">
          <input
            .value=${this._puzzle}
            maxlength="81"
            @input=${(e: InputEvent) => (this._puzzle = (e.target as HTMLInputElement).value ?? '')}
          />
          ${this._puzzle.length === 81
            ? html`<sudoku-board>
                  ${this.#getCurrentStep()?.map(
                    (cell, i) =>
                      html`<sudoku-cell
                        ?given=${cell.given}
                        ?active=${cell.active}
                        .candidates=${cell.candidates}
                        value=${cell.value ?? ''}
                        column=${i % 9}
                        row=${Math.floor(i / 9)}
                      ></sudoku-cell>`
                  )}
                </sudoku-board>
                <div class="description">${this._steps[this._currentStep]?.description}</div>`
            : null}
        </div>

        <sudoku-button slot="footer-start" @click=${() => this.#step('backward')} ?disabled=${this._currentStep <= 0}>
          <sudoku-icon icon="undo"></sudoku-icon>
        </sudoku-button>
        <sudoku-button
          slot="footer-end"
          @click=${() => this.#step('forward')}
          ?disabled=${this._currentStep >= this._steps.length - 1}
        >
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

  #getCurrentStep = () => {
    if (this._puzzle.length !== 81) {
      return;
    }
    const cells = this._steps[this._currentStep].snapshot;
    return cells.map((cell, i) => {
      return {
        given: this._steps[0].snapshot[i].value === cell.value,
        value: cell.value,
        candidates: cell.candidates.map((c) => c.toString()),
        active: this._currentStep > 0 && this._steps[this._currentStep - 1].snapshot[i].value !== cell.value,
      };
    });
  };

  #step = (direction: 'forward' | 'backward') => {
    if (direction === 'backward') {
      this._currentStep -= 1;
      if (this._currentStep < 0) {
        this._currentStep = 0;
      }
    } else {
      this._currentStep += 1;
      if (this._currentStep >= this._steps.length) {
        this._currentStep = this._steps.length - 1;
      }
    }
  };

  #handleKeyboard = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'ArrowLeft':
        this.#step('backward');
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        this.#step('forward');
        break;
    }
  };
}
