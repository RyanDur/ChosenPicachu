import {FC, ReactElement} from 'react';
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

type Demo = {topic: DemoTopics; pageName: string; listed: Listing};

const headingOf = (topic: DemoTopics): string => `Demos ${demoTab.names[topic]}`;

const demoAt = (pathname: string): Maybe<Demo> => tableTutorials.at(pathname)
  .map((tutorial): Demo => ({
    topic: DemoTopics.tables,
    pageName: `${headingOf(DemoTopics.tables)} · ${tableTutorials.nameOf(tutorial)}`,
    listed: names.tables[tutorial]
  }))
  .or(() => tableParts.shownAt(pathname).map((part): Demo => ({
    topic: DemoTopics.tables,
    pageName: `${headingOf(DemoTopics.tables)} · ${tableParts.told(part).name}`,
    listed: names.tableParts[part]
  })))
  .or(() => accordionParts.shownAt(pathname).map((part): Demo => ({
    topic: DemoTopics.accordions,
    pageName: `${headingOf(DemoTopics.accordions)} · ${accordionParts.told(part).name}`,
    listed: names.accordions[part]
  })))
  .or(() => zIndexParts.shownAt(pathname).map((part): Demo => ({
    topic: DemoTopics.zIndex,
    pageName: `${headingOf(DemoTopics.zIndex)} · ${zIndexParts.told(part).name}`,
    listed: names['z-index'][part]
  })))
  .or(() => chartKinds.shownAt(pathname).map((kind): Demo => ({
    topic: DemoTopics.charts,
    pageName: `${headingOf(DemoTopics.charts)} · ${chartKinds.names[kind]}`,
    listed: names.charts[kind]
  })))
  .or(() => demoTab.addressedAt(pathname)
    .map((topic): Demo => ({topic, pageName: headingOf(topic), listed: names.demos[topic]})));

type AddressedDemo = {
  whenShown: (show: (demo: Demo) => ReactElement) => ReactElement | null;
  shownOr: (show: (demo: Demo) => ReactElement, notShown: () => ReactElement) => ReactElement;
};

const addressed = (demo: Maybe<Demo>): AddressedDemo => ({
  whenShown: show => demo.map(show).orNull(),
  shownOr: (show, notShown) => demo.either(show, notShown)
});

const useAddressedDemo = (): AddressedDemo => addressed(demoAt(useLocation().pathname));

const DemoHeader: FC = () => useAddressedDemo().whenShown(({topic, pageName, listed}) =>
  <Header pageName={pageName} heading={headingOf(topic)} listed={listed}/>);

export const ErrorBoundary: FC = () => <><DemoHeader/><Main><PageError/></Main></>;

export const Room: FC = () => useAddressedDemo().shownOr(
  ({topic}) => <><DemoHeader/><Main><Trading><DemosPage topic={topic}><Outlet/></DemosPage></Trading></Main></>,
  () => <NoSuchRoom/>);
