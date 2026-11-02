import {FC} from 'react';
import {Outlet, useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {PageError} from '@pages/PageError';
import NoSuchRoom from '@pages/NoRoom/route';
import names from '@pages/names.json';
import {Paths} from '@pages/Paths';
import {demoTopicAt, DemoTopics, topicNames} from './types';
import {DemosPage} from './DemosPage';
import {Trading} from './Trading';

const headerOf = (topic: DemoTopics) => <Header title={`Demos ${topicNames[topic]}`} listed={names.demos[topic]}/>;

const useTopic = (): Maybe<DemoTopics> => demoTopicAt(useLocation().pathname.slice(Paths.demos.length).split('/')[0]);

export const ErrorBoundary: FC = () => {
  const header = useTopic().map(headerOf).orElse(null);
  return <Page header={header}><PageError/></Page>;
};

const Room: FC = () => useTopic().either(
  topic => <Page header={headerOf(topic)}><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Page>,
  () => <NoSuchRoom/>);

export default Room;
