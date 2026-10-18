import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {useSearchParamsObject} from '@components/search-params';
import names from '@pages/names.json';
import {DevelopmentPage} from './DevelopmentPage';
import {developmentTabParam, DevelopmentTabs, tabConcerns} from './types';

const DevelopmentHeader = () => {
  const {tab} = useSearchParamsObject({tab: developmentTabParam}, {tab: DevelopmentTabs.structure});
  return <Header title={`Development ${tabConcerns[tab]}`} listed={names.development[tab]}/>;
};

export const Development = {
  path: Paths.development,
  errorElement: <Page header={<DevelopmentHeader/>}><PageError/></Page>,
  element: <Page header={<DevelopmentHeader/>}><DevelopmentPage/></Page>
};
