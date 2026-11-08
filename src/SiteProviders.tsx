import {FC, PropsWithChildren} from 'react';
import {EnvProvider} from '@frame/state';
import {OpeningFragmentProvider} from '@frame/navigation/arrival';
import {Environment} from '@frame/state';

type Props = PropsWithChildren<{readonly env: Environment}>;

export const SiteProviders: FC<Props> = ({env, children}) =>
  <EnvProvider env={env}>
    <OpeningFragmentProvider>{children}</OpeningFragmentProvider>
  </EnvProvider>;
