import {FC} from 'react';
import {Link, useLocation} from 'react-router';
import {maybe} from '@ryandur/sand';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {useCarriedAddress} from './useCarriedAddress';
import './TabPager.css';

const course = Object.values(DemoTopics);

export const TabPager: FC<{readonly topic: DemoTopics}> = ({topic}) => {
  const carried = useCarriedAddress();
  const ariaCurrent = demoTab.currentAt(useLocation().pathname, topic);
  const place = course.indexOf(topic);
  const previous = maybe(course[place - 1]);
  const next = maybe(course[place + 1]);
  const currentSlot = next.either(() => previous.either(() => 'current', () => 'previous'), () => 'next');

  return <>
    {previous.map(previousTopic =>
      <Link key="previous" to={carried(demoTab.address(previousTopic))} className="tab-pager previous icon-button borderless field attentive reachable">
        <span className="off-screen">Previous tab, {demoTab.names[previousTopic]}</span>
      </Link>).orNull()}
    <Link key={currentSlot} to={carried(demoTab.address(topic))} aria-current={ariaCurrent} className="tab-pager current path field attentive bold reachable">
      {demoTab.names[topic]}
    </Link>
    {next.map(nextTopic =>
      <Link key="next" to={carried(demoTab.address(nextTopic))} className="tab-pager next icon-button borderless field attentive reachable">
        <span className="off-screen">Next tab, {demoTab.names[nextTopic]}</span>
      </Link>).orNull()}
  </>;
};
