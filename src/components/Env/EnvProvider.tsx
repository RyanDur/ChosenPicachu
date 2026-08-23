import {createContext, FC, PropsWithChildren, useContext} from 'react';
import {Env, env} from '@env';

const EnvContext = createContext<Env>(env);

type Props = PropsWithChildren<{ env?: Partial<Env> }>;

export const EnvProvider: FC<Props> = ({env: overrides, children}) =>
  <EnvContext.Provider value={{...env, ...overrides}}>{children}</EnvContext.Provider>;

export const useEnv = (): Env => useContext(EnvContext);
