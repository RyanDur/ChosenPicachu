import {FC, PropsWithChildren} from 'react';

export const Words: FC<PropsWithChildren> = ({children}) =>
  <article className="step-words">{children}</article>;
