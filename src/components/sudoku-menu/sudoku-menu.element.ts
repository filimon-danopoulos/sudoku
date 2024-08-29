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
      <sudoku-button ?toggled=${this._open} @click=${this.#handleClick}>
        <sudoku-icon icon="ellipsis"></sudoku-icon>
      </sudoku-button>
      ${this._open
        ? html`<div class="sudoku-menu">
            <slot></slot>
          </div>`
        : null}
    `;
  }

  #handleClick = () => {
    if (this._open) {
      document.addEventListener(
        'mouseup',
        () => {
          this._open = false;
        },
        { once: true }
      );
    } else {
      this._open = true;
    }
  };
}
