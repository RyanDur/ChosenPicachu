import {FC, PropsWithChildren} from 'react';
import {EnvProvider} from '@frame/page';
import {OpeningFragmentProvider} from '@components/OpeningFragment';
import {Env} from '@env';

type Props = PropsWithChildren<{readonly env: Env}>;

export const SiteProviders: FC<Props> = ({env, children}) =>
  <EnvProvider env={env}>
    <OpeningFragmentProvider>{children}</OpeningFragmentProvider>
  </EnvProvider>;
