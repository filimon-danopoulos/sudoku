import style from './sudoku-input.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sudoku-input')
export class SudokuInputElement extends LitElement {
  static styles = [style];

  render() {
    return html`
      <div class="buttons">
        ${Array.from({ length: 9 }, (_, i) => {
          const number = (i + 1).toString();
          return html`
            <button @pointerdown=${() => this.#handleInputDown(number)} @pointerup=${() => this.#handleInputUp(number)}>
              ${number}
            </button>
          `;
        })}
      </div>
      <div class="progress">
        <div class="indicator ${this.progress === 1 ? 'complete' : ''}" style="width: ${this.progress * 100}%;}"></div>
      </div>
    `;
  }

  @property({ attribute: 'progress', type: Number })
  accessor progress = 0;

  #candidateTimeout?: ReturnType<typeof setTimeout>;
  #handleInputDown = (value: string) => {
    this.#candidateTimeout = setTimeout(() => {
      this.#candidateTimeout = undefined;
      this.#dispatchInputEvent(value);
    }, 200);
  };

  #handleInputUp = (value: string) => {
    if (this.#candidateTimeout) {
      this.#dispatchInputEvent(value);
    }
    clearTimeout(this.#candidateTimeout);
    this.#candidateTimeout = undefined;
  };

  #dispatchInputEvent(value: string) {
    const isCandidate = !this.#candidateTimeout;
    const eventType = isCandidate ? 'input-candidate' : 'input-value';
    this.dispatchEvent(
      new CustomEvent(eventType, {
        detail: value,
      })
    );
  }
}
