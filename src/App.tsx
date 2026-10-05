import {ComponentProps, FC, StrictMode} from 'react';
import {RouterProvider} from 'react-router';
import {EnvProvider} from '@components/Env';
import {OpeningFragmentProvider} from '@components/OpeningFragment';
import {Env} from '@env';

type Props = {
  readonly router: ComponentProps<typeof RouterProvider>['router'];
  readonly onError: ComponentProps<typeof RouterProvider>['onError'];
  readonly env: Env;
};

export const App: FC<Props> = ({router, onError, env}) =>
  <StrictMode>
    <EnvProvider env={env}>
      <OpeningFragmentProvider>
        <RouterProvider router={router} onError={onError}/>
      </OpeningFragmentProvider>
    </EnvProvider>
  </StrictMode>;
