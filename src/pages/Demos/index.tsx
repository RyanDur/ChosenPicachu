import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {useSearchParamsObject} from '@components/search-params';
import {DemoTopics, demoTopicParam} from './types';
import {DemosPage} from './DemosPage';
import {Trading} from './Trading';
import {ChartPage} from './Charts/ChartPage';
import {capitalized} from './capitalized';

const DemosHeader = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  return <Header title={`Demos ${capitalized(tab)}`}/>;
};

export const TradingFloor = {
  errorElement: <PageError/>,
  element: <Trading/>
};

export const Demos = {
  errorElement: <PageError/>,
  handle: {header: DemosHeader, mainClassName: 'in-view'},
  element: <DemosPage/>
};

export const ChartTutorial = {
  errorElement: <PageError/>,
  handle: {header: () => <Header title="Demos Charts"/>, mainClassName: 'in-view'},
  element: <ChartPage/>
};
