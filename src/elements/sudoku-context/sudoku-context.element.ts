import style from './sudoku-context.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { difficulty } from '../../storage/puzzle-storage';
import { provide } from '@lit/context';
import { difficultyContext } from './difficulty-context';

@customElement('sudoku-context')
export class SudokuContextElement extends LitElement {
  @provide({ context: difficultyContext })
  @property({ attribute: false })
  difficulty: difficulty = 'moderate';

  static styles = [style];
  render() {
    return html`<slot></slot>`;
  }
}
