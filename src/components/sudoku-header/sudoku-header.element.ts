import styles from './sudoku-header.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <span class="dificulty">Test</span>
  <button>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
      <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
    </svg>
  </button>
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
