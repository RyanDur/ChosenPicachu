import {FC, PropsWithChildren} from 'react';

export const Steps: FC<PropsWithChildren> = ({children}) =>
  <ol className="steps" aria-label="the steps">{children}</ol>;
