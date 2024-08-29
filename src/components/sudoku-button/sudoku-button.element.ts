import styles from './sudoku-button.css' with { type: 'css' };

export class SudokuButtonElement extends HTMLElement {
  #buttonElement: HTMLButtonElement;
  constructor() {
    super();

    const $root = this.attachShadow({
      mode: 'open',
    });
    $root.adoptedStyleSheets.push(styles);
    $root.innerHTML = `
      <button>
        <slot></slot>
      </button>
    `;
    this.#buttonElement = $root.querySelector('button') as HTMLButtonElement;
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(disabled) {
    this.#buttonElement.disabled = disabled;
    this.toggleAttribute('disabled', disabled);
  }
}

if (!customElements.get('sudoku-button')) {
  customElements.define('sudoku-button', SudokuButtonElement);
}
