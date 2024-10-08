import style from './sudoku-input.css' with { type: 'css' };

import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('sudoku-input')
export class SudokuInputElement extends LitElement {
  static styles = [style];

  @property({ attribute: 'progress', type: Number })
  accessor progress = 0;

  @property({ attribute: false })
  accessor completed = [] as string[];

  render() {
    return html`
      <div class="buttons">
        ${Array.from({ length: 9 }, (_, i) => {
          const number = (i + 1).toString();
          return html`
            <button
              ?completed=${this.completed.includes(number)}
              @pointerdown=${() => this.#handleInputDown(number)}
            >
              ${number}
            </button>
          `;
        })}
      </div>
      <div class="progress">
        <div class="indicator" style="width: ${this.progress * 100}%;}"></div>
      </div>
    `;
  }

  #candidateTimeout?: ReturnType<typeof setTimeout>;
  #handleInputDown = (value: string) => {
    document.addEventListener('pointerup', () => this.#handleInputUp(value), { once: true });
    this.#candidateTimeout = setTimeout(() => {
      this.#candidateTimeout = undefined;
      this.#dispatchInputEvent(value);
    }, 250);
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
