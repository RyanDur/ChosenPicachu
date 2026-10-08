import {Paths} from '@pages/Paths';
import {Header} from '@pages/BasePage/Header';
import {useSearchParamsObject} from '@components/search-params';
import {demoTopicParam, DemoTopics} from './types';
import {capitalized} from './capitalized';
import {useParams} from 'react-router';
import names from '@pages/names.json';
import {isChartKind} from './Charts/kinds';

const DemosHeader = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  return <Header title={`Demos ${capitalized(tab)}`} listed={names.demos[tab]}/>;
};

const ChartsHeader = () => {
  const {kind} = useParams();
  return <Header title="Demos Charts" listed={isChartKind(kind) ? names.charts[kind] : names.demos.charts}/>;
};

export const Demos = {
  lazy: () => import('.').then(({TradingFloor}) => TradingFloor),
  children: [
    {
      path: Paths.demos,
      handle: {header: DemosHeader, mainClassName: 'in-view'},
      lazy: () => import('.').then(({DemoTabs}) => DemoTabs)
    },
    {
      path: Paths.chartTutorial,
      handle: {header: ChartsHeader, mainClassName: 'in-view'},
      lazy: () => import('.').then(({ChartTutorial}) => ChartTutorial)
    }
  ]
};
