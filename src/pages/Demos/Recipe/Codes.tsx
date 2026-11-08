import {FC, PropsWithChildren} from 'react';

export const Codes: FC<PropsWithChildren> = ({children}) =>
  <figure className="step-code">{children}</figure>;
