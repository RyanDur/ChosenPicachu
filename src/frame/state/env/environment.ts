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
