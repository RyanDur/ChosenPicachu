import {Paths} from '@pages/Paths';
import {Header} from '@pages/BasePage/Header';
import {useSearchParamsObject} from '@components/search-params';
import {DemoTopics, demoTopicParam} from './types';
import {capitalized} from './capitalized';

const DemosHeader = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  return <Header title={`Demos ${capitalized(tab)}`}/>;
};

const ChartsHeader = () => <Header title="Demos Charts"/>;

export const Demos = {
  lazy: () => import('.').then(({TradingFloor}) => TradingFloor),
  children: [
    {
      path: Paths.demos,
      handle: {header: DemosHeader, mainClassName: 'in-view'},
      lazy: () => import('.').then(({Demos: tabs}) => tabs)
    },
    {
      path: Paths.chartTutorial,
      handle: {header: ChartsHeader, mainClassName: 'in-view'},
      lazy: () => import('.').then(({ChartTutorial}) => ChartTutorial)
    }
  ]
};
