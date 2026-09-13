import {FC, PropsWithChildren, useId} from 'react';

export const Reveal: FC<PropsWithChildren> = ({children}) => {
  const opener = `reveal${useId()}`;
  return <details className="step-reveal" aria-labelledby={opener}>
    <summary id={opener} className="opener sub-title">how we built it</summary>
    {children}
  </details>;
};
