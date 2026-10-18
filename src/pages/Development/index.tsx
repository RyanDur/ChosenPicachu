import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {Listing} from '@pages/BasePage/useListing';
import {Concern} from '@pages/Record/moments/concerns';
import names from '@pages/names.json';
import {DevelopmentPage} from './DevelopmentPage';
import {useConcernShown} from './types';

const listings: Record<Concern, Listing> = {
  'Structure': names.development.structure,
  'Presentation': names.development.presentation,
  'Dynamic Interaction': names.development['dynamic-interaction']
};

const DevelopmentHeader = () => {
  const concern = useConcernShown();
  return <Header title={`Development ${concern}`} listed={listings[concern]}/>;
};

export const Development = {
  path: Paths.development,
  errorElement: <Page header={<DevelopmentHeader/>}><PageError/></Page>,
  element: <Page header={<DevelopmentHeader/>}><DevelopmentPage/></Page>
};
