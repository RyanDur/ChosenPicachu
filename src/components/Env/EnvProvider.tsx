import {createContext, FC, PropsWithChildren, useContext} from 'react';
import {Env, unconfigured} from '@env';

const EnvContext = createContext<Env>(unconfigured);

type Props = PropsWithChildren<{readonly env: Env}>;

export const EnvProvider: FC<Props> = ({env, children}) =>
  <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;

export const useEnv = (): Env => useContext(EnvContext);
