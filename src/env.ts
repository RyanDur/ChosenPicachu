export type Env = {
  tradeFeed: string;
  tradeProduct: string;
  tradeHistory: string;
  aicDomain: string;
  harvardDomain: string;
  harvardAPIKey: string;
  vamDomain: string;
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
  harvardDomain: '',
  harvardAPIKey: '',
  vamDomain: ''
};

export const env: Env = window.__env ?? unconfigured;
