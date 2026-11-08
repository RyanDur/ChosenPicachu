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

type Place = {topic: DemoTopics; title: string; listed: Listing};

const placeAt = (pathname: string): Maybe<Place> => tableTutorials.at(pathname)
  .map((tutorial): Place => ({
    topic: DemoTopics.tables,
    title: `Demos ${topicNames[DemoTopics.tables]} · ${tableTutorials.nameOf(tutorial)}`,
    listed: names.tables[tutorial]
  }))
  .or(() => maybe(Object.values(DemoTopics).find(topic => pathname === demoAddress(topic)))
    .map((topic): Place => ({topic, title: `Demos ${topicNames[topic]}`, listed: names.demos[topic]})));

const usePlace = (): Maybe<Place> => placeAt(useLocation().pathname);

const DemoHeader: FC = () => usePlace().either(
  ({title, listed}) => <Header title={title} listed={listed}/>,
  () => null);

export const ErrorBoundary: FC = () => <Page header={<DemoHeader/>}><PageError/></Page>;

export const Room: FC = () => usePlace().either(
  ({topic}) => <Page header={<DemoHeader/>}><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Page>,
  () => <NoSuchRoom/>);
