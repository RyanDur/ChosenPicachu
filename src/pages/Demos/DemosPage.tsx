import {FC, PropsWithChildren} from 'react';
import {useLocation} from 'react-router';
import './DemosPage.css';
import './Tutorials.css';
import {Tabs} from '@navigation/Tabs';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {TabLink} from './TabLink';
import {TabPager} from './TabPager';
import {useCarriedAddress} from './useCarriedAddress';

export const DemosPage: FC<PropsWithChildren<{topic: DemoTopics}>> = ({topic, children}) => {
  const carried = useCarriedAddress();
  const onTheTab = demoTab.isAddressOf(useLocation().pathname, topic);
  const currentAs = onTheTab ? 'page' : 'true';

  return <>
    {onTheTab && <p className="demos-opening paragraph">
      Each tab below is one feature a page needs. I built each one here and explain it. The tabs run from simple to
      expert, and each adds one thing to the tabs before
      it. <TabLink to={DemoTopics.accordions}>The accordions</TabLink> build one fold several ways, from HTML alone up
      to script. <TabLink to={DemoTopics.zIndex}>The z-index tab</TabLink> explains a component, its state and an event,
      which every later tab uses, and the browser’s top layer, which the charts and tables tabs
      use. <TabLink to={DemoTopics.dragAndDrop}>The drag sort tab</TabLink> uses the browser’s own drag, with script
      only for what that drag lacks and a key for every
      move. <TabLink to={DemoTopics.charts}>The charts tab</TabLink> draws trades that keep arriving, each one checked
      where it enters. <TabLink to={DemoTopics.tables}>The tables tab</TabLink> builds one feature from those parts, in
      the order it was asked for. A tab opens on the problem it is about, then shows an exhibit. Every tab but drag sort
      lists its parts, and each part is a page of its own. Start with the accordions if HTML, CSS and JavaScript are new
      to you. Otherwise start at the first tab that adds something you don’t know, or go to the tab whose bug you came
      with.
    </p>}
    <Tabs label="demos" className="demo-tabs field-before field-after" current={topic} currentAs={currentAs}
      tabs={Object.values(DemoTopics).map(param =>
        ({display: demoTab.names[param], param, to: carried(demoTab.address(param))}))}>
      <TabPager topic={topic} currentAs={currentAs}/>
    </Tabs>
    <section id="about" aria-label={demoTab.names[topic]} className="about">
      {children}
    </section>
  </>;
};
