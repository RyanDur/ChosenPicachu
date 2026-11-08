import {FC, PropsWithChildren} from 'react';
import type {Environment} from '@transport';
import {environmentContext} from './environmentContext';

type Props = PropsWithChildren<{readonly environment: Environment}>;

export const EnvironmentProvider: FC<Props> = ({environment, children}) =>
  <environmentContext.Provider value={environment}>{children}</environmentContext.Provider>;
