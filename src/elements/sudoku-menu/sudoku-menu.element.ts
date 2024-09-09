import '../sudoku-button/sudoku-button.element';
import '../sudoku-icon/sudoku-icon.element';

import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import style from './sudoku-menu.css' with { type: 'css' };

@customElement('sudoku-menu')
export class SudokuMenuElement extends LitElement {
  static styles = [style];

  @state()
  private accessor _open = false;

  render() {
    return html`
      <sudoku-button ?toggled=${this._open} @click=${this.#open}>
        <sudoku-icon icon="ellipsis"></sudoku-icon>
      </sudoku-button>
      ${this._open
        ? html`<div class="backdrop" @click=${this.#close}>
            <div class="sudoku-menu">
              <slot></slot>
            </div>
          </div> `
        : null}
    `;
  }

  #open = () => {
    if (!this._open) {
      this._open = true;
    }
  };

  #close = () => {
    this._open = false;
  };
}
