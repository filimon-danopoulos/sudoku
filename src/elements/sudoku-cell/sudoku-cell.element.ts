import style from './sudoku-cell.css' with { type: 'css' };

import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sudoku-cell')
export class SudokuCelllement extends LitElement {
  static styles = [style];

  @property({ attribute: 'value', type: String })
  accessor value = '';

  @property({ attribute: 'solution', type: String })
  accessor solution = '';

  @property({ attribute: 'given', type: Boolean })
  accessor given = false;

  @property({ attribute: 'highlight', type: Boolean })
  accessor highlight = false;

  @property({ attribute: 'invalid', type: Boolean })
  accessor invalid = false;

  @property({ attribute: 'active', type: Boolean })
  accessor active = false;

  @property({ attribute: 'candidates', type: Array })
  accessor candidates = [] as string[];

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('value') || changed.has('candidates')) {
      this.invalid = false;
    }
  }

  render() {
    return html`
      <div class="cell">
        ${this.value
          ? html`<div class="cell-value">${this.value}</div>`
          : html`<div class="cell-candidates">
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('1')}>1</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('2')}>2</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('3')}>3</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('4')}>4</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('5')}>5</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('6')}>6</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('7')}>7</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('8')}>8</div>
              <div class="cell-candidate" ?hidden=${!this.candidates.includes('9')}>9</div>
            </div>`}
      </div>
    `;
  }
}
