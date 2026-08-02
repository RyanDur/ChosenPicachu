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

export const env: Env = {
  tradeFeed: import.meta.env.VITE_APP_TRADE_FEED,
  tradeProduct: import.meta.env.VITE_APP_TRADE_PRODUCT,
  tradeHistory: import.meta.env.VITE_APP_TRADE_HISTORY,
  aicDomain: import.meta.env.VITE_APP_API_AIC,
  harvardDomain: import.meta.env.VITE_APP_HARVARD_API,
  harvardAPIKey: import.meta.env.VITE_APP_HARVARD_API_KEY,
  vamDomain: import.meta.env.VITE_APP_VAM_API
};

const EnvContext = createContext<Env>(env);

type Props = PropsWithChildren<{ env?: Partial<Env> }>;

export const EnvProvider: FC<Props> = ({env: overrides, children}) =>
  <EnvContext.Provider value={{...env, ...overrides}}>{children}</EnvContext.Provider>;

export const useEnv = (): Env => useContext(EnvContext);
