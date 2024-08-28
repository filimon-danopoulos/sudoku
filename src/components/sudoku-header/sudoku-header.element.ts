import styles from './sudoku-header.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <slot name="difficulty"></slot>
  <slot name="action"></slot>
`;

export class SudokuHeaderElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot?.adoptedStyleSheets.push(styles);
    const $content = document.importNode($template.content, true);
    this.shadowRoot?.appendChild($content);
  }

  static get observedAttributes() {
    return [];
  }
}

if (!customElements.get('sudoku-header')) {
  customElements.define('sudoku-header', SudokuHeaderElement);
}
