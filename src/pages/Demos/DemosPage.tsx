import {FC, PropsWithChildren} from 'react';
import './DemosPage.css';
import './Tutorials.css';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {DemoTabs} from './DemoTabs';
import {TabLink} from './TabLink';
import {useShownTopic} from './useShownTopic';

export const DemosPage: FC<PropsWithChildren> = ({children}) => {
  const topic = useShownTopic();
  return <>
    <p className="demos-opening paragraph">
      Each tab below is one feature a page needs, and each adds one thing to the tabs before it.
      Start with <TabLink to={DemoTopics.accordions}>the accordions</TabLink> if HTML, CSS and JavaScript are
      new to you. Otherwise start at the first tab that adds something you don’t know, or go to the tab whose bug you
      came with.
    </p>
    <DemoTabs/>
    <section id="about" aria-label={demoTab.names[topic]} className="about">
      {children}
    </section>
  </>;
};
