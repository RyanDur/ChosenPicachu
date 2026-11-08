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

const useConcern = (): Maybe<Concern> => practiceAddress.concernFromSegment(useParams().concern);

const ConcernHeader: FC = () => useConcern().either(
  concern => <Header title={`Practice ${concern}`} listed={listings[concern]}/>,
  () => null);

export const ErrorBoundary: FC = () => <Page header={<ConcernHeader/>}><PageError/></Page>;

export const Room: FC = () => useConcern().either(
  concern => <Page header={<ConcernHeader/>}><PracticePage concern={concern}/></Page>,
  () => <NoSuchRoom/>);
