import {FC, ReactNode} from 'react';
import {Outlet, useLocation} from 'react-router';
import {Maybe, maybe} from '@ryandur/sand';
import {Header, Page, PageError} from '@page';
import {Room as NoSuchRoom} from '@pages/NoRoom';
import names from '@navigation/names.json';
import {demoAddress, DemoTopics, topicNames} from './types';
import {DemosPage} from './DemosPage';
import {Trading} from './Market/Trading';
import {Tutorial, tableTutorials} from './Tables';

const tabHeader = (topic: DemoTopics) => <Header title={`Demos ${topicNames[topic]}`} listed={names.demos[topic]}/>;

const tutorialHeader = (tutorial: Tutorial) =>
  <Header title={`Demos ${topicNames[DemoTopics.tables]} · ${tableTutorials.nameOf(tutorial)}`} listed={names.tables[tutorial]}/>;

type Shown = {topic: DemoTopics; header: ReactNode};

const tabAt = (pathname: string): Maybe<Shown> =>
  maybe(Object.values(DemoTopics).find(topic => pathname === demoAddress(topic)))
    .map(topic => ({topic, header: tabHeader(topic)}));

const useDemo = (): Maybe<Shown> => {
  const {pathname} = useLocation();
  return tableTutorials.at(pathname).either(
    tutorial => maybe({topic: DemoTopics.tables, header: tutorialHeader(tutorial)}),
    () => tabAt(pathname));
};

export const ErrorBoundary: FC = () => {
  const header = useDemo().map(({header}) => header).orElse(null);
  return <Page header={header}><PageError/></Page>;
};

export const Room: FC = () => useDemo().either(
  ({topic, header}) => <Page header={header}><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Page>,
  () => <NoSuchRoom/>);
