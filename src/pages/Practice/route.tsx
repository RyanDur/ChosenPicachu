import {FC} from 'react';
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

export const ErrorBoundary: FC = () => <Page header={<PracticeHeader/>}><PageError/></Page>;

const Room: FC = () => <Page header={<PracticeHeader/>}><PracticePage/></Page>;

export default Room;
