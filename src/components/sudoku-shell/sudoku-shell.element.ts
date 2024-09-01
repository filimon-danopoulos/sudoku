import '../sudoku-header/sudoku-header.element';
import '../sudoku-footer/sudoku-footer.element';
import '../sudoku-button/sudoku-button.element';
import '../sudoku-icon/sudoku-icon.element';
import '../sudoku-drawer/sudoku-drawer.element';

import style from './sudoku-shell.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

@customElement('sudoku-shell')
export class SudokuShellElement extends LitElement {
  static styles = [style];

  @property({ attribute: 'view', type: String })
  accessor view = '';

  @state()
  private accessor _drawerOpen = false;

  render() {
    return html`
      <sudoku-header>
        <sudoku-button
          slot="navigation"
          ?toggled=${this._drawerOpen}
          @click=${() => (this._drawerOpen = !this._drawerOpen)}
        >
          <sudoku-icon icon="menu"></sudoku-icon>
        </sudoku-button>
        <slot name="header-title" slot="title"></slot>
        <slot name="header-actions" slot="actions"></slot>
      </sudoku-header>
      ${this._drawerOpen
        ? html`<sudoku-drawer view=${this.view} @close=${() => (this._drawerOpen = false)}></sudoku-drawer>`
        : null}
      <div class="content">
        <slot name="content"></slot>
      </div>
      <sudoku-footer>
        <slot name="footer-start" slot="start"></slot>
        <slot name="footer-middle" slot="middle"></slot>
        <slot name="footer-end" slot="end"></slot>
      </sudoku-footer>
    `;
  }
}
