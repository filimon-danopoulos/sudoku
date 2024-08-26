import styles from './sudoku-cell.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <div class="sudoku-cell"></div>
`;

export class SudokuCelllement extends HTMLElement {
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
    return ['value'];
  }

  attributeChangedCallback(
    name: string,
    oldVal: string | null,
    newVal: string | null
  ): void {
    if (name === 'value') {
      const $cell = this.shadowRoot?.querySelector(
        '.sudoku-cell'
      ) as HTMLDivElement;
      $cell.textContent = newVal ? (+newVal % 9).toString() : '';
    }
  }

  get value() {
    return this.getAttribute('value') ?? '';
  }
  set value(value: string) {
    this.setAttribute('value', value.toString());
  }

  get solution() {
    return this.getAttribute('solution') ?? '';
  }
  set solution(solution: string) {
    this.setAttribute('solution', solution);
  }

  get given() {
    return this.hasAttribute('given');
  }
  set given(given: boolean) {
    this.toggleAttribute('given', given);
  }

  connectedCallback() {}
}

if (!customElements.get('sudoku-cell')) {
  customElements.define('sudoku-cell', SudokuCelllement);
}
