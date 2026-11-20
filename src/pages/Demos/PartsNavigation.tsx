import {FC, PropsWithChildren} from 'react';
import {useLocation} from 'react-router';
import {demoTab} from './demo-tab';
import './PartsNavigation.css';

export const PartsNavigation: FC<PropsWithChildren> = ({children}) => {
  const Heading: 'h2' | 'h3' = demoTab.tabAt(useLocation().pathname).either(() => 'h2', () => 'h3');
  return <nav aria-labelledby="parts-index-heading" className="parts-index">
    <Heading id="parts-index-heading" className="off-screen">Parts</Heading>
    {children}
  </nav>;
};
