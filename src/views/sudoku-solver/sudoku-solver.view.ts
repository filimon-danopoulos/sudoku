import '../../elements/sudoku-shell/sudoku-shell.element';
import '../../elements/sudoku-menu/sudoku-menu.element';
import '../../elements/sudoku-option/sudoku-option.element';
import '../../elements/sudoku-board/sudoku-board.element';
import '../../elements/sudoku-cell/sudoku-cell.element';
import '../../elements/sudoku-input/sudoku-input.element';
import '../../elements/sudoku-icon/sudoku-icon.element';

import style from './sudoku-solver.css' with { type: 'css' };

import { html, LitElement, PropertyValues } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { Grader } from '../../sudoku/grader/Grader';
import { Sudoku } from '../../sudoku/model/Sudoku';

@customElement('sudoku-solver-view')
export class SudokuSolverView extends LitElement {
  static styles = [style];

  @property({ attribute: 'sudoku', type: String })
  sudoku = '';

  @state()
  private accessor _input = '';

  @state()
  private accessor _currentStep = 0;

  @state()
  private accessor _steps = [] as {
    description: string;
    snapshot: { value: string; candidates: string[] }[];
  }[];

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('sudoku') && this.sudoku.length === 81) {
      const sudoku = new Sudoku(this.sudoku);
      const grader = new Grader();
      const { steps } = grader.grade(sudoku);
      this._steps = steps;
    }

    if (changed.has('_input') && this._input.length === 81) {
      window.location.hash = `#/solver/${this._input}`;
    }
  }

  render() {
    return html`
      <sudoku-shell view="solver">
        <span slot="header-title">Solver</span>
        <div class="content" slot="content">
          ${this.sudoku.length === 81
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
            : html`<div class="input">
                Enter a puzzle:
                <textarea
                  rows="4"
                  maxlength="81"
                  @input=${(e: Event) => (this._input = (e.target as HTMLTextAreaElement).value)}
                ></textarea>
              </div>`}
        </div>

        <sudoku-button
          slot="footer-start"
          @click=${() => this.#step('backward')}
          ?disabled=${this._currentStep <= 0}
        >
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
    if (this.sudoku.length !== 81) {
      return;
    }
    const cells = this._steps[this._currentStep].snapshot;
    return cells.map((cell, i) => {
      return {
        given: this._steps[0].snapshot[i].value === cell.value,
        value: cell.value,
        candidates: cell.candidates.map((c) => c.toString()),
        active:
          this._currentStep > 0 &&
          this._steps[this._currentStep - 1].snapshot[i].value !== cell.value,
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
