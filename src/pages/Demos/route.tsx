import {FC} from 'react';
import {useParams} from 'react-router';
import {maybe} from '@ryandur/sand';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {PageError} from '@pages/PageError';
import NoSuchRoom from '@pages/NoRoom/route';
import names from '@pages/names.json';
import {demoTopicAt, DemoTopics, topicNames} from './types';
import {DemosPage} from './DemosPage';
import {Trading} from './Trading';

const headerOf = (topic: DemoTopics) => <Header title={`Demos ${topicNames[topic]}`} listed={names.demos[topic]}/>;

const useTopic = (): DemoTopics | undefined => demoTopicAt(useParams().topic);

export const ErrorBoundary: FC = () => {
  const topic = useTopic();
  return <Page header={maybe(topic).map(headerOf).orElse(null)}><PageError/></Page>;
};

const Room: FC = () => maybe(useTopic()).either(
  topic => <Page header={headerOf(topic)}><Trading><DemosPage topic={topic}/></Trading></Page>,
  () => <NoSuchRoom/>);

export default Room;
