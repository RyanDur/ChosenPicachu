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
  usersDomain: ''
};

export const env: Env = window.__env ?? unconfigured;
