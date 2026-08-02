import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {useSearchParamsObject} from '@components/search-params';
import {DemoTopics, demoTopicParam} from './types';
import {DemosPage} from './component';

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
