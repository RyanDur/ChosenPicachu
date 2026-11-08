import {FC, PropsWithChildren} from 'react';
import {Environment} from '@transport';
import {EnvProvider} from '@page';
import {OpeningFragmentProvider} from '@navigation/arrival';

type Props = PropsWithChildren<{readonly env: Environment}>;

export const SiteProviders: FC<Props> = ({env, children}) =>
  <EnvProvider env={env}>
    <OpeningFragmentProvider>{children}</OpeningFragmentProvider>
  </EnvProvider>;
