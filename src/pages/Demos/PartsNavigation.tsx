import {FC, PropsWithChildren} from 'react';
import {useLocation} from 'react-router';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import './PartsNavigation.css';

export const PartsNavigation: FC<PropsWithChildren> = ({children}) => {
  const {pathname} = useLocation();
  const Heading = Object.values(DemoTopics).some(topic => demoTab.isAddressOf(pathname, topic)) ? 'h2' : 'h3';
  return <nav aria-labelledby="parts-index-heading" className="parts-index">
    <Heading id="parts-index-heading" className="off-screen">Parts</Heading>
    {children}
  </nav>;
};
