/// <reference types="vite/client" />

declare module '*?frame' {
  const compiled: string;
  export default compiled;
}

declare module '*?sample' {
  import type {Sample} from '@pages/Demos/Recipe/sample';
  const sample: Sample;
  export default sample;
}
