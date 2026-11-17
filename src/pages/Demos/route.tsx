import {FC} from 'react';
import {Outlet, useLocation} from 'react-router';
import {Maybe, maybe} from '@ryandur/sand';
import {Header, Listing, Main, PageError} from '@page';
import {Room as NoSuchRoom} from '@pages/NoRoom';
import names from '@navigation/names.json';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {DemosPage} from './DemosPage';
import {Trading} from './Market/Trading';
import {tableTutorials} from './Tables';
import {accordionParts} from './Accordions';

type ShownDemo = {topic: DemoTopics; title: string; listed: Listing};

const shownDemoAt = (pathname: string): Maybe<ShownDemo> => tableTutorials.at(pathname)
  .map((tutorial): ShownDemo => ({
    topic: DemoTopics.tables,
    title: `Demos ${demoTab.names[DemoTopics.tables]} · ${tableTutorials.nameOf(tutorial)}`,
    listed: names.tables[tutorial]
  }))
  .or(() => accordionParts.shownAt(pathname).map((part): ShownDemo => ({
    topic: DemoTopics.accordions,
    title: `Demos ${demoTab.names[DemoTopics.accordions]} · ${accordionParts.told(part).name}`,
    listed: names.accordions[part]
  })))
  .or(() => maybe(Object.values(DemoTopics).find(topic => pathname === demoTab.address(topic)))
    .map((topic): ShownDemo => ({topic, title: `Demos ${demoTab.names[topic]}`, listed: names.demos[topic]})));

const useShownDemo = (): Maybe<ShownDemo> => shownDemoAt(useLocation().pathname);

const DemoHeader: FC = () => useShownDemo().either(
  ({title, listed}) => <Header title={title} listed={listed}/>,
  () => null);

export const ErrorBoundary: FC = () => <><DemoHeader/><Main><PageError/></Main></>;

export const Room: FC = () => useShownDemo().either(
  ({topic}) => <><DemoHeader/><Main><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Main></>,
  () => <NoSuchRoom/>);
