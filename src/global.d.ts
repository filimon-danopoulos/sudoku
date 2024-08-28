declare module '*.css' {
  const style: CSSStyleSheet;
  export default style;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
