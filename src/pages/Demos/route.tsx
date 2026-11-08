import {FC} from 'react';
import {Outlet, useLocation} from 'react-router';
import {Maybe, maybe, some} from '@ryandur/sand';
import {Header, Page, PageError} from '@page';
import {Room as NoSuchRoom} from '@pages/NoRoom';
import names from '@navigation/names.json';
import {demoAddress, DemoTopics, topicNames} from './types';
import {DemosPage} from './DemosPage';
import {Trading} from './Market/Trading';
import {tableTutorials} from './Tables';

const topicAt = (pathname: string): Maybe<DemoTopics> => tableTutorials.at(pathname).either(
  () => some(DemoTopics.tables),
  () => maybe(Object.values(DemoTopics).find(topic => pathname === demoAddress(topic))));

const useTopic = (): Maybe<DemoTopics> => topicAt(useLocation().pathname);

const DemoHeader: FC = () => {
  const {pathname} = useLocation();
  return tableTutorials.at(pathname).either(
    tutorial => <Header title={`Demos ${topicNames[DemoTopics.tables]} · ${tableTutorials.nameOf(tutorial)}`}
      listed={names.tables[tutorial]}/>,
    () => topicAt(pathname).either(
      topic => <Header title={`Demos ${topicNames[topic]}`} listed={names.demos[topic]}/>,
      () => null));
};

export const ErrorBoundary: FC = () => <Page header={<DemoHeader/>}><PageError/></Page>;

export const Room: FC = () => useTopic().either(
  topic => <Page header={<DemoHeader/>}><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Page>,
  () => <NoSuchRoom/>);
