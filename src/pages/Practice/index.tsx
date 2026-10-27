import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {Listing} from '@pages/BasePage/useListing';
import {Concern, concernsInOrder} from '@pages/Record/moments/concerns';
import {ToSavedTab} from '@components/Tabs';
import names from '@pages/names.json';
import {PracticePage} from './PracticePage';
import {concernOf, practiceAddress} from './types';

const listings: Record<Concern, Listing> = {
  'Structure': names.practice.structure,
  'Presentation': names.practice.presentation,
  'Behavior': names.practice.behavior
};

const movedFrom = '/development/';

const practiceTab = (concern: Concern) => {
  const header = <Header title={`Practice ${concern}`} listed={listings[concern]}/>;
  return {
    path: practiceAddress(concern),
    errorElement: <Page header={header}><PageError/></Page>,
    element: <Page header={header}><PracticePage concern={concern}/></Page>
  };
};

const toSavedConcern = <ToSavedTab addressOf={tab => practiceAddress(concernOf(tab))}/>;

export const Practice = [
  {path: Paths.practice, element: toSavedConcern},
  ...concernsInOrder.map(practiceTab),
  {path: movedFrom, element: toSavedConcern}
];
