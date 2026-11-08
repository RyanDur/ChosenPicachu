import {FC, PropsWithChildren} from 'react';
import type {Env} from './environment';
import {envContext} from './envContext';

type Props = PropsWithChildren<{readonly env: Env}>;

export const EnvProvider: FC<Props> = ({env, children}) =>
  <envContext.Provider value={env}>{children}</envContext.Provider>;
