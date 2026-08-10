import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {useSearchParamsObject} from '@components/search-params';
import {DemoTopics, demoTopicParam} from './types';
import {DemosPage} from './component';
import {ChartPage} from './Charts/ChartPage';

const DemosHeader = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  return <Header title={`Demos ${tab}`}/>;
};

export const Demos = {
  path: Paths.demos,
  errorElement: <PageError/>,
  handle: {header: DemosHeader, mainClassName: 'in-view'},
  element: <DemosPage/>
};

export const ChartTutorial = {
  path: `${Paths.demos}charts/:kind/`,
  errorElement: <PageError/>,
  handle: {header: () => <Header title="Demos charts"/>, mainClassName: 'in-view'},
  element: <ChartPage/>
};
