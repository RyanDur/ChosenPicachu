import {FC, lazy, Suspense} from 'react';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {PageError} from '@pages/PageError';
import {useSearchParamsObject} from '@components/search-params';
import {demoTopicParam, DemoTopics, topicNames} from './types';
import names from '@pages/names.json';
import {Trading} from './Trading';

const DemosPage = lazy(() => import('./DemosPage').then(({DemosPage}) => ({default: DemosPage})));

const DemosHeader = () => {
  const {tab} = useSearchParamsObject({tab: demoTopicParam}, {tab: DemoTopics.accordions});
  return <Header title={`Demos ${topicNames[tab]}`} listed={names.demos[tab]}/>;
};

export const ErrorBoundary: FC = () => <Page header={<DemosHeader/>}><PageError/></Page>;

const Room: FC = () => <Page header={<DemosHeader/>}><Trading><Suspense><DemosPage/></Suspense></Trading></Page>;

export default Room;
