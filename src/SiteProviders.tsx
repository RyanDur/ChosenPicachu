import {FC, PropsWithChildren} from 'react';
import {Environment} from '@transport';
import {EnvironmentProvider} from '@environment';

type Props = PropsWithChildren<{readonly environment: Environment}>;

export const SiteProviders: FC<Props> = ({environment, children}) =>
  <EnvironmentProvider environment={environment}>{children}</EnvironmentProvider>;
