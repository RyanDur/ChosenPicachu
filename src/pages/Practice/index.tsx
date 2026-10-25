import {Navigate, useLocation} from 'react-router';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {Listing} from '@pages/BasePage/useListing';
import {Concern} from '@pages/Record/moments/concerns';
import names from '@pages/names.json';
import {PracticePage} from './PracticePage';
import {useConcernShown} from './useConcernShown';

const listings: Record<Concern, Listing> = {
  'Structure': names.practice.structure,
  'Presentation': names.practice.presentation,
  'Behavior': names.practice.behavior
};

const PracticeHeader = () => {
  const concern = useConcernShown();
  return <Header title={`Practice ${concern}`} listed={listings[concern]}/>;
};

const movedFrom = '/development/';

const ToPractice = () => {
  const {search} = useLocation();
  return <Navigate replace to={`${Paths.practice}${search}`}/>;
};

export const Practice = [
  {
    path: Paths.practice,
    errorElement: <Page header={<PracticeHeader/>}><PageError/></Page>,
    element: <Page header={<PracticeHeader/>}><PracticePage/></Page>
  },
  {path: movedFrom, element: <ToPractice/>}
];
