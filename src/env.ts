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
};

declare global {
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
  feedbackToken: ''
};

// the build renders the page shell in Node, where there is no window and so no env.js
export const env: Env = typeof window === 'undefined' ? unconfigured : window.__env ?? unconfigured;
