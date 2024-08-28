import styles from './sudoku-cell.css' with { type: 'css' };

const $template = document.createElement('template');
$template.innerHTML = `
  <div class="cell">
    <div class="cell-value"></div>
    <div class="cell-candidates" hidden>
      <div class="cell-candidate" hidden candidate="1">1</div>
      <div class="cell-candidate" hidden candidate="2">2</div>
      <div class="cell-candidate" hidden candidate="3">3</div>
      <div class="cell-candidate" hidden candidate="4">4</div>
      <div class="cell-candidate" hidden candidate="5">5</div>
      <div class="cell-candidate" hidden candidate="6">6</div>
      <div class="cell-candidate" hidden candidate="7">7</div>
      <div class="cell-candidate" hidden candidate="8">8</div>
      <div class="cell-candidate" hidden candidate="9">9</div>
    </div>
  </div>
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
    return ['value', 'candidates'];
  }

  attributeChangedCallback(name: string): void {
    if (name === 'value') {
      const $value = this.shadowRoot?.querySelector(
        '.cell-value'
      ) as HTMLElement;
      $value.textContent = this.value;
      if (this.value && this.candidates.length) {
        this.candidates = [];
      }
      if (this.invalid) {
        this.invalid = false;
      }
    }

    if (name === 'candidates') {
      const $candidates = this.shadowRoot?.querySelector(
        '.cell-candidates'
      ) as HTMLElement;
      if (this.value && this.candidates.length) {
        this.value = '';
      }
      $candidates.hidden = !this.candidates.length;
      this.shadowRoot
        ?.querySelectorAll<HTMLElement>('.cell-candidate')
        .forEach(($candidate) => {
          $candidate.hidden = !this.candidates.includes(
            $candidate.textContent as string
          );
        });

      if (this.invalid) {
        this.invalid = false;
      }
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

  get invalid() {
    return this.hasAttribute('invalid');
  }
  set invalid(invalid: boolean) {
    this.toggleAttribute('invalid', invalid);
  }

  get active() {
    return this.hasAttribute('active');
  }
  set active(active: boolean) {
    this.toggleAttribute('active', active);
  }

  get candidates() {
    const candidatesString = this.getAttribute('candidates');
    return candidatesString ? candidatesString.split(',') : [];
  }
  set candidates(candidates: string[]) {
    this.setAttribute('candidates', candidates.join());
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this.active = !this.active;
      if (this.active) {
        this.dispatchEvent(
          new Event('cell-activated', { bubbles: true, composed: true })
        );
      }
    });
  }
}

if (!customElements.get('sudoku-cell')) {
  customElements.define('sudoku-cell', SudokuCelllement);
}
