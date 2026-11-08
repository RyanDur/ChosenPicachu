import {FC, PropsWithChildren} from 'react';
import type {Environment} from '@transport';
import {envContext} from './envContext';

type Props = PropsWithChildren<{readonly env: Environment}>;

export const EnvProvider: FC<Props> = ({env, children}) =>
  <envContext.Provider value={env}>{children}</envContext.Provider>;
