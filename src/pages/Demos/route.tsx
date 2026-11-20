import {FC} from 'react';
import {Outlet, useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Header, Listing, Main, PageError} from '@page';
import {Room as NoSuchRoom} from '@pages/NoRoom';
import names from '@navigation/names.json';
import {DemoTopics} from './demo-topics';
import {demoTab} from './demo-tab';
import {DemosPage} from './DemosPage';
import {Trading} from './Market/Trading';
import {tableParts, tableTutorials} from './Tables';
import {accordionParts} from './Accordions/part-pages';
import {zIndexParts} from './ZIndexDemo/part-pages';
import {chartKinds} from './Charts';

type ShownDemo = {topic: DemoTopics; title: string; listed: Listing};

const shownDemoAt = (pathname: string): Maybe<ShownDemo> => tableTutorials.at(pathname)
  .map((tutorial): ShownDemo => ({
    topic: DemoTopics.tables,
    title: `Demos ${demoTab.names[DemoTopics.tables]} · ${tableTutorials.nameOf(tutorial)}`,
    listed: names.tables[tutorial]
  }))
  .or(() => tableParts.shownAt(pathname).map((part): ShownDemo => ({
    topic: DemoTopics.tables,
    title: `Demos ${demoTab.names[DemoTopics.tables]} · ${tableParts.told(part).name}`,
    listed: names.tableParts[part]
  })))
  .or(() => accordionParts.shownAt(pathname).map((part): ShownDemo => ({
    topic: DemoTopics.accordions,
    title: `Demos ${demoTab.names[DemoTopics.accordions]} · ${accordionParts.told(part).name}`,
    listed: names.accordions[part]
  })))
  .or(() => zIndexParts.shownAt(pathname).map((part): ShownDemo => ({
    topic: DemoTopics.zIndex,
    title: `Demos ${demoTab.names[DemoTopics.zIndex]} · ${zIndexParts.told(part).name}`,
    listed: names['z-index'][part]
  })))
  .or(() => chartKinds.shownAt(pathname).map((kind): ShownDemo => ({
    topic: DemoTopics.charts,
    title: `Demos ${demoTab.names[DemoTopics.charts]} · ${chartKinds.names[kind]}`,
    listed: names.charts[kind]
  })))
  .or(() => demoTab.addressedAt(pathname)
    .map((topic): ShownDemo => ({topic, title: `Demos ${demoTab.names[topic]}`, listed: names.demos[topic]})));

const useShownDemo = (): Maybe<ShownDemo> => shownDemoAt(useLocation().pathname);

const DemoHeader: FC = () => useShownDemo().either(
  ({title, listed}) => <Header title={title} listed={listed}/>,
  () => null);

export const ErrorBoundary: FC = () => <><DemoHeader/><Main><PageError/></Main></>;

export const Room: FC = () => useShownDemo().either(
  ({topic}) => <><DemoHeader/><Main><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Main></>,
  () => <NoSuchRoom/>);
