import {FC, PropsWithChildren} from 'react';

export const Reveal: FC<PropsWithChildren> = ({children}) =>
  <details className="step-reveal">
    <summary className="opener sub-title">how we built it</summary>
    <div className="step-built">{children}</div>
  </details>;
