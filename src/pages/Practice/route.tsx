import {FC} from 'react';
import {useParams} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Header, Listing, Page, PageError} from '@page';
import {Concern} from '@pages/Record/concerns';
import {Room as NoSuchRoom} from '@pages/NoRoom';
import names from '@navigation/names.json';
import {PracticePage} from './PracticePage';
import {practiceAddress} from './practiceAddress';

const listings: Record<Concern, Listing> = {
  'Structure': names.practice.structure,
  'Presentation': names.practice.presentation,
  'Behavior': names.practice.behavior
};

const headerOf = (concern: Concern) => <Header title={`Practice ${concern}`} listed={listings[concern]}/>;

const useConcern = (): Maybe<Concern> => practiceAddress.concernFromSegment(useParams().concern);

export const ErrorBoundary: FC = () => {
  const header = useConcern().map(headerOf).orElse(null);
  return <Page header={header}><PageError/></Page>;
};

export const Room: FC = () => useConcern().either(
  concern => <Page header={headerOf(concern)}><PracticePage concern={concern}/></Page>,
  () => <NoSuchRoom/>);
