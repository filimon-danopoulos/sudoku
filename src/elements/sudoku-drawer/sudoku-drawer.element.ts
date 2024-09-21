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
          <div class="title">Pages</div>
          <sudoku-button @click=${this.#close}>
            <sudoku-icon icon="chevron-left" style="--icon-size: 16px;"></sudoku-icon>
          </sudoku-button>
        </div>

        <div class="content">
          <a class="option" href="#/sudoku">
            <sudoku-icon icon="dice"></sudoku-icon>
            Game
          </a>
          <a class="option" href="#/solver">
            <sudoku-icon icon="question"></sudoku-icon>
            Solver
          </a>
          <a class="option" href="#/settings">
            <sudoku-icon icon="cog"></sudoku-icon>
            Settings
          </a>
        </div>
      </div>
    </div>`;
  }

  #close() {
    this.dispatchEvent(new Event('close'));
  }
}
