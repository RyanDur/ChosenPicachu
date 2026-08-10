import {FC, PropsWithChildren} from 'react';

export const Codes: FC<PropsWithChildren> = ({children}) =>
  <div className="step-code">{children}</div>;
