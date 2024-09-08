import '../sudoku-icon/sudoku-icon.element';
import '../sudoku-button/sudoku-button.element';

import { html, LitElement } from 'lit';
import style from './sudoku-drawer.css' with { type: 'css' };

import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { difficultyContext } from '../sudoku-context/difficulty-context';
import { difficulty } from '../../storage/puzzle-storage';

@customElement('sudoku-drawer')
export class SudokuDrawerElement extends LitElement {
  static styles = [style];

  @consume({ context: difficultyContext, subscribe: true })
  private _difficulty: difficulty = 'moderate';

  render() {
    return html`<div class="backdrop" @click=${this.#close}>
      <div class="drawer">
        <div class="header">
          <div class="title">Sudoku</div>
          <sudoku-button @click=${this.#close}>
            <sudoku-icon icon="chevron-left" style="--icon-size: 16px;"></sudoku-icon>
          </sudoku-button>
        </div>

        <div class="content">
          <div class="sub-title">Navigation</div>
          <a class="option" ?active=${this.#isActivePath('#/sudoku')} href="#/sudoku/new/">
            <sudoku-icon icon="dice"></sudoku-icon>
            Game
          </a>
          <a class="option" ?active=${this.#isActivePath('#/solver')} href="#/solver">
            <sudoku-icon icon="question"></sudoku-icon>
            Solver
          </a>
          ${this.#isActivePath('#/sudoku')
            ? html`
                <div class="sub-title">Difficulty</div>
                ${(['easy', 'moderate', 'hard', 'extreme'] as const).map(
                  (difficulty) => html`
                    <a class="option" href="#/sudoku/new/${difficulty}">
                      <sudoku-icon
                        icon=${this._difficulty === difficulty ? 'radio-checked' : 'radio-empty'}
                      ></sudoku-icon>
                      <span class="difficulty">${difficulty}</span>
                    </a>
                  `
                )}
              `
            : null}
        </div>
      </div>
    </div>`;
  }

  #close() {
    this.dispatchEvent(new Event('close'));
  }

  #isActivePath(path: string) {
    return window.location.hash?.startsWith(path);
  }
}
