import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {TabPager} from './TabPager';
import {useCarriedAddress} from './useCarriedAddress';
import {useShownTopic} from './useShownTopic';
import '@navigation/Tabs/Tabs.css';
import './DemoTabs.css';

export const DemoTabs: FC = () => {
  const shown = useShownTopic();
  const carried = useCarriedAddress();
  const {pathname} = useLocation();
  return <nav aria-label="demos" className="tabs demo-tabs backdrop backdrop-above contained swipe-scrolled field-before field-after">
    <ol className="tab-list">
      {Object.values(DemoTopics).map(topic => <li key={topic} className="demo-tab caption field attentive backdrop-underlined">
        <Link to={carried(demoTab.address(topic))} preventScrollReset aria-describedby={`${topic}-point`}
          aria-current={topic === shown ? demoTab.currentAt(pathname, topic) : undefined}
          className="demo-tab-name large-body bold ink void-dot-before reachable">{demoTab.names[topic]}</Link>
        <span id={`${topic}-point`} className="balanced">{demoTab.points[topic]}</span>
      </li>)}
    </ol>
    <TabPager/>
  </nav>;
};
