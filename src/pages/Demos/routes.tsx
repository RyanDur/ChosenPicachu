import {lazy, Suspense} from 'react';
import {Paths} from '@pages/Paths';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {PageError} from '@pages/PageError';
import {ToSavedTab} from '@components/Tabs';
import {demoAddress, demoTopicOf, DemoTopics, topicNames} from './types';
import {useParams} from 'react-router';
import names from '@pages/names.json';
import {isChartKind} from './Charts/kinds';
import {Trading} from './Trading';

const DemosPage = lazy(() => import('./DemosPage').then(({DemosPage}) => ({default: DemosPage})));
const ChartPage = lazy(() => import('./Charts/ChartPage').then(({ChartPage}) => ({default: ChartPage})));

const ChartsHeader = () => {
  const {kind} = useParams();
  return <Header title="Demos Charts" listed={isChartKind(kind) ? names.charts[kind] : names.demos.charts}/>;
};

const demoTab = (topic: DemoTopics) => {
  const header = <Header title={`Demos ${topicNames[topic]}`} listed={names.demos[topic]}/>;
  return {
    path: demoAddress(topic),
    errorElement: <Page header={header}><PageError/></Page>,
    element: <Page header={header}><Trading><Suspense><DemosPage topic={topic}/></Suspense></Trading></Page>
  };
};

export const Demos = [
  {path: Paths.demos, element: <ToSavedTab addressOf={tab => demoAddress(demoTopicOf(tab))}/>},
  ...Object.values(DemoTopics).map(demoTab),
  {
    path: Paths.chartTutorial,
    errorElement: <Page header={<ChartsHeader/>}><PageError/></Page>,
    element: <Page header={<ChartsHeader/>}><Trading><Suspense><ChartPage/></Suspense></Trading></Page>
  }
];
