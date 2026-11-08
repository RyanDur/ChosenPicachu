import {FC, PropsWithChildren, StrictMode} from 'react';
import {Layout} from './root';

export const Site: FC<PropsWithChildren> = ({children}) =>
  <StrictMode><Layout>{children}</Layout></StrictMode>;
