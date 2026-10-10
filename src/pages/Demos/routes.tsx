import {lazy, Suspense} from 'react';
import {Paths} from '@pages/Paths';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {PageError} from '@pages/PageError';
import {useSearchParamsObject} from '@components/search-params';
import {demoTopicParam, DemoTopics} from './types';
import {capitalized} from './capitalized';
import {useParams} from 'react-router';
import names from '@pages/names.json';
import {isChartKind} from './Charts/kinds';
import {Trading} from './Trading';

const DemosPage = lazy(() => import('./DemosPage').then(({DemosPage}) => ({default: DemosPage})));
const ChartPage = lazy(() => import('./Charts/ChartPage').then(({ChartPage}) => ({default: ChartPage})));

const DemosHeader = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  return <Header title={`Demos ${capitalized(tab)}`} listed={names.demos[tab]}/>;
};

const ChartsHeader = () => {
  const {kind} = useParams();
  return <Header title="Demos Charts" listed={isChartKind(kind) ? names.charts[kind] : names.demos.charts}/>;
};

export const Demos = [
  {
    path: Paths.demos,
    errorElement: <Page header={<DemosHeader/>}><PageError/></Page>,
    element: <Page header={<DemosHeader/>}><Trading><Suspense><DemosPage/></Suspense></Trading></Page>
  },
  {
    path: Paths.chartTutorial,
    errorElement: <Page header={<ChartsHeader/>}><PageError/></Page>,
    element: <Page header={<ChartsHeader/>}><Trading><Suspense><ChartPage/></Suspense></Trading></Page>
  }
];
