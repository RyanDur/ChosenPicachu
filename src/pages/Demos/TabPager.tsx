import {FC} from 'react';
import {Link} from 'react-router';
import {maybe} from '@ryandur/sand';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {useCarriedAddress} from './useCarriedAddress';
import './TabPager.css';

const course = Object.values(DemoTopics);

export const TabPager: FC<{readonly topic: DemoTopics}> = ({topic}) => {
  const carried = useCarriedAddress();
  const place = course.indexOf(topic);
  const previous = maybe(course[place - 1]);
  const next = maybe(course[place + 1]);

  return <>
    {previous.map(previousTopic =>
      <Link key="previous" to={carried(demoTab.address(previousTopic))} preventScrollReset className="tab-pager previous field attentive bold">
        <span className="off-screen">Previous tab, {demoTab.names[previousTopic]}</span>
      </Link>).orNull()}
    <span aria-current="page" className="tab-pager current field bold">{demoTab.names[topic]}</span>
    {next.map(nextTopic =>
      <Link key="next" to={carried(demoTab.address(nextTopic))} preventScrollReset className="tab-pager next field attentive bold">
        <span className="off-screen">Next tab, {demoTab.names[nextTopic]}</span>
      </Link>).orNull()}
  </>;
};
