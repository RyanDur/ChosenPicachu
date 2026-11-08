import type {Env} from './environment';
import {unconfigured} from './unconfigured';

// the build pre-renders the pages in Node, where there is no env.js, so they are drawn from the values env.js is built
// from
export const env: Env = import.meta.env.SSR ? __BUILT_ENV__ : window.__env ?? unconfigured;
