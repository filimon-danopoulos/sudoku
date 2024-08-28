import styles from './sudoku-option.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <slot></slot>
`;

export class SudokuOptionElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot?.adoptedStyleSheets.push(styles);
    const $content = document.importNode($template.content, true);
    this.shadowRoot?.appendChild($content);
  }
}

if (!customElements.get('sudoku-option')) {
  customElements.define('sudoku-option', SudokuOptionElement);
}
