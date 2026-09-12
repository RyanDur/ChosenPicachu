import {ComponentProps, FC, StrictMode} from 'react';
import {RouterProvider} from 'react-router';
import {EnvProvider} from '@components/Env';
import {Env} from '@env';

type Props = {
  readonly router: ComponentProps<typeof RouterProvider>['router'];
  readonly onError: ComponentProps<typeof RouterProvider>['onError'];
  readonly env: Env;
};

export const App: FC<Props> = ({router, onError, env}) =>
  <StrictMode>
    <EnvProvider env={env}>
      <RouterProvider router={router} onError={onError}/>
    </EnvProvider>
  </StrictMode>;
