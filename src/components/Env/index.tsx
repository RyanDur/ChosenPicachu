import {createContext, FC, PropsWithChildren, useContext} from 'react';

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

const unconfigured: Env = {
  tradeFeed: '',
  tradeProduct: '',
  tradeHistory: '',
  aicDomain: '',
  harvardDomain: '',
  harvardAPIKey: '',
  vamDomain: ''
};

export const env: Env = window.__env ?? unconfigured;

const EnvContext = createContext<Env>(env);

type Props = PropsWithChildren<{ env?: Partial<Env> }>;

export const EnvProvider: FC<Props> = ({env: overrides, children}) =>
  <EnvContext.Provider value={{...env, ...overrides}}>{children}</EnvContext.Provider>;

export const useEnv = (): Env => useContext(EnvContext);
