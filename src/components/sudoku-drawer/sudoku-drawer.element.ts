import '../sudoku-icon/sudoku-icon.element';
import '../sudoku-button/sudoku-button.element';

import { html, LitElement } from 'lit';
import style from './sudoku-drawer.css' with { type: 'css' };

import { customElement, property } from 'lit/decorators.js';

@customElement('sudoku-drawer')
export class SudokuDrawerElement extends LitElement {
  static styles = [style];

  @property({ attribute: 'view', type: String })
  accessor view = '';

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
          <div class="option" ?active=${this.view === 'game'} @click=${() => this.#navigate('game')}>
            <sudoku-icon icon="dice"></sudoku-icon>
            Game
          </div>
          <div class="option" ?active=${this.view === 'solver'} @click=${() => this.#navigate('solver')}>
            <sudoku-icon icon="question"></sudoku-icon>
            Solver
          </div>
        </div>
      </div>
    </div>`;
  }

  #close() {
    this.dispatchEvent(new Event('close'));
  }

  #navigate(view: string) {
    if (this.view !== view) {
      this.dispatchEvent(
        new CustomEvent('navigate', {
          composed: true,
          bubbles: true,
          detail: view,
        })
      );
    }
  }
}
