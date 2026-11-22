import {FC, useId} from 'react';
import {Link, useLocation} from 'react-router';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {TabPager} from './TabPager';
import {useCarriedAddress} from './useCarriedAddress';
import './DemoTabs.css';

const DemoTab: FC<{topic: DemoTopics; current: DemoTopics}> = ({topic, current}) => {
  const carried = useCarriedAddress();
  const {pathname} = useLocation();
  const point = useId();
  return <li className="demo-tab caption field attentive backdrop-underlined">
    <Link to={carried(demoTab.address(topic))} preventScrollReset aria-describedby={point}
      aria-current={topic === current ? demoTab.currentAt(pathname, topic) : undefined}
      className="demo-tab-name body-size bold ink void-dot-before reachable">{demoTab.names[topic]}</Link>
    <span id={point} className="balanced">{demoTab.points[topic]}</span>
  </li>;
};

export const DemoTabs: FC<{topic: DemoTopics}> = ({topic}) =>
  <nav aria-label="demos" className="tabs demo-tabs backdrop backdrop-above contained swipe-scrolled field-before field-after">
    <ol className="tab-list">
      {Object.values(DemoTopics).map(each => <DemoTab key={each} topic={each} current={topic}/>)}
    </ol>
    <TabPager topic={topic}/>
  </nav>;
