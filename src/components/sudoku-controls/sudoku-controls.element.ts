import styles from './sudoku-controls.css' with { type: 'css' };
import undoIcon from '../../icons/undo.svg';
import clearIcon from '../../icons/clear.svg';
import redoIcon from '../../icons/redo.svg';

const $template = document.createElement('template');
$template.innerHTML = `
  <button class="undo">
    ${undoIcon}
  </button>
  <button class="clear">
    ${clearIcon}
  </button>
  <button class="redo">
    ${redoIcon}
  </button>
`;

export class SudokuControlsElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: 'open',
    });
    this.shadowRoot?.adoptedStyleSheets.push(styles);
    const $content = document.importNode($template.content, true);
    this.shadowRoot?.appendChild($content);
  }

  connectedCallback() {
    this.shadowRoot
      ?.querySelector('button.clear')
      ?.addEventListener('click', () => {
        this.dispatchEvent(new Event('clear'));
      });
  }
}

if (!customElements.get('sudoku-controls')) {
  customElements.define('sudoku-controls', SudokuControlsElement);
}
