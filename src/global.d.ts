declare module '*.css' {
  const style: CSSStyleSheet;
  export default style;
}

declare module '*.svg' {
  const url: string;
  export default url;
}
