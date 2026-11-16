import {FC, PropsWithChildren} from 'react';

export const Want: FC<PropsWithChildren> = ({children}) =>
  <p className="step-want paragraph italic muted-ink">{children}</p>;
