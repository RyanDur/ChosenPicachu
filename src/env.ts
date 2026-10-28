export type Env = {
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
  const __BUILT_ENV__: Env;

  // augmenting Window only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Window {
    __env?: Env;
  }
}

export const unconfigured: Env = {
  tradeFeed: '',
  tradeProduct: '',
  tradeHistory: '',
  aicDomain: '',
  aicPictures: '',
  harvardDomain: '',
  harvardAPIKey: '',
  vamDomain: '',
  vamPictures: '',
  clevelandDomain: '',
  usersDomain: '',
  feedbackToken: '',
  feedbackEndpoint: ''
};

// the build pre-renders the pages in Node, where there is no env.js, so they are drawn from the values env.js is built from
export const env: Env = import.meta.env.SSR ? __BUILT_ENV__ : window.__env ?? unconfigured;
