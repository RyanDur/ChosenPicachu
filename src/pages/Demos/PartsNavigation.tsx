import {FC, PropsWithChildren} from 'react';
import './PartsNavigation.css';

export const PartsNavigation: FC<PropsWithChildren<{readonly titled?: boolean}>> = ({titled = false, children}) =>
  titled
    ? <nav aria-labelledby="parts-index-heading" className="parts-index">
      <h2 id="parts-index-heading" className="off-screen">Parts</h2>
      {children}
    </nav>
    : <nav aria-label="Parts" className="parts-index">{children}</nav>;
