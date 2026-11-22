import {FC, PropsWithChildren} from 'react';
import {useLocation} from 'react-router';
import './DemosPage.css';
import './Tutorials.css';
import {Tabs} from '@navigation/Tabs';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {TabPager} from './TabPager';
import {useCarriedAddress} from './useCarriedAddress';

export const DemosPage: FC<PropsWithChildren<{topic: DemoTopics}>> = ({topic, children}) => {
  const carried = useCarriedAddress();
  const {pathname} = useLocation();

  return <>
    <p className="demos-opening paragraph">
      Each tab below is one feature a page needs, and each adds one thing to the tabs before it. Start with the
      accordions if HTML, CSS and JavaScript are new to you. Otherwise start at the first tab that adds something you
      don’t know, or go to the tab whose bug you came with.
    </p>
    <Tabs label="demos" className="demo-tabs field-before field-after" current={topic} aria-current={demoTab.currentAt(pathname, topic)}
      tabs={Object.values(DemoTopics).map(param =>
        ({display: demoTab.names[param], param, to: carried(demoTab.address(param))}))}>
      <TabPager topic={topic}/>
    </Tabs>
    <section id="about" aria-label={demoTab.names[topic]} className="about">
      {children}
    </section>
  </>;
};
