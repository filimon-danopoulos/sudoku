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

  @property({ attribute: 'highlights', type: Array })
  accessor highlights = [] as string[];

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
      <div class="cell" ?highlight=${!!this.value && this.highlights.includes(this.value)}>
        ${this.value
          ? html`<div class="cell-value">${this.value}</div>`
          : html`<div class="cell-candidates">
              ${Array.from({ length: 9 }, (_, i) => {
                const value = (i + 1).toString();
                return html`<div
                  class="cell-candidate"
                  ?hidden=${!this.candidates.includes(value)}
                  ?highlight=${this.highlights.includes(value)}
                >
                  ${value}
                </div>`;
              })}
            </div>`}
      </div>
    `;
  }
}
