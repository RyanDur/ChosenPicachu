import {FC, PropsWithChildren} from 'react';
import './PartsNavigation.css';

export const PartsNavigation: FC<PropsWithChildren<{readonly level: 2 | 3}>> = ({level, children}) => {
  const Heading: 'h2' | 'h3' = level === 2 ? 'h2' : 'h3';
  return <nav aria-labelledby="parts-index-heading" className="parts-index">
    <Heading id="parts-index-heading" className="off-screen">Parts</Heading>
    {children}
  </nav>;
};
