declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      src?: string;
      ar?: boolean;
      'camera-controls'?: boolean;
      'touch-action'?: string;
      'auto-rotate'?: boolean;
      'shadow-intensity'?: string;
      style?: React.CSSProperties;
      alt?: string;
    };
  }
}
