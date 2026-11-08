import {FC} from 'react';
import {Outlet, useLocation} from 'react-router';
import {Maybe, maybe} from '@ryandur/sand';
import {Header, Listing, Page, PageError} from '@page';
import {Room as NoSuchRoom} from '@pages/NoRoom';
import names from '@navigation/names.json';
import {demoAddress, DemoTopics, topicNames} from './types';
import {DemosPage} from './DemosPage';
import {Trading} from './Market/Trading';
import {tableTutorials} from './Tables';

type ShownDemo = {topic: DemoTopics; title: string; listed: Listing};

const shownDemoAt = (pathname: string): Maybe<ShownDemo> => tableTutorials.at(pathname)
  .map((tutorial): ShownDemo => ({
    topic: DemoTopics.tables,
    title: `Demos ${topicNames[DemoTopics.tables]} · ${tableTutorials.nameOf(tutorial)}`,
    listed: names.tables[tutorial]
  }))
  .or(() => maybe(Object.values(DemoTopics).find(topic => pathname === demoAddress(topic)))
    .map((topic): ShownDemo => ({topic, title: `Demos ${topicNames[topic]}`, listed: names.demos[topic]})));

const useShownDemo = (): Maybe<ShownDemo> => shownDemoAt(useLocation().pathname);

const DemoHeader: FC = () => useShownDemo().either(
  ({title, listed}) => <Header title={title} listed={listed}/>,
  () => null);

export const ErrorBoundary: FC = () => <Page header={<DemoHeader/>}><PageError/></Page>;

export const Room: FC = () => useShownDemo().either(
  ({topic}) => <Page header={<DemoHeader/>}><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Page>,
  () => <NoSuchRoom/>);
