import {FC, PropsWithChildren} from 'react';
import {Env} from '@env';
import {envContext} from './envContext';

type Props = PropsWithChildren<{readonly env: Env}>;

export const EnvProvider: FC<Props> = ({env, children}) =>
  <envContext.Provider value={env}>{children}</envContext.Provider>;
