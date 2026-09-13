import {FC, PropsWithChildren} from 'react';

export const Reveal: FC<PropsWithChildren> = ({children}) =>
  <details className="step-reveal" aria-label="how we built it">
    <summary className="opener sub-title">how we built it</summary>
    {children}
  </details>;
