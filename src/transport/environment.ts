import {unconfigured} from './unconfigured';

export type Environment = {
  tradeFeed: string;
  tradeProduct: string;
  tradeHistory: string;
  aicDomain: string;
  aicPictures: string;
  harvardDomain: string;
  harvardAPIKey: string;
  vamDomain: string;
  vamPictures: string;
  clevelandDomain: string;
  usersDomain: string;
  feedbackToken: string;
  feedbackEndpoint: string;
};

declare global {
  const __BUILT_ENV__: Environment;

  // augmenting Window only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Window {
    __env?: Environment;
  }
}

// the build pre-renders the pages in Node, where there is no env.js, so they are drawn from the values env.js is built
// from
export const environment: Environment = import.meta.env.SSR ? __BUILT_ENV__ : window.__env ?? unconfigured;
