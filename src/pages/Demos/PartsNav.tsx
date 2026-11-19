import {FC, PropsWithChildren} from 'react';
import './PartsNav.css';

export const PartsNav: FC<PropsWithChildren> = ({children}) =>
  <nav aria-labelledby="parts-index-heading" className="parts-index">
    <h2 id="parts-index-heading" className="off-screen">Parts</h2>
    {children}
  </nav>;
