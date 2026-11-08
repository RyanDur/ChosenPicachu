import {FC} from 'react';
import {useParams} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Header, Listing, Page, PageError} from '@frame/page';
import {Concern} from '@pages/Record/moments/concerns';
import {Room as NoSuchRoom} from '@pages/NoRoom/route';
import names from '@frame/navigation/names.json';
import {PracticePage} from './PracticePage';
import {concernAt} from './types';

const listings: Record<Concern, Listing> = {
  'Structure': names.practice.structure,
  'Presentation': names.practice.presentation,
  'Behavior': names.practice.behavior
};

const headerOf = (concern: Concern) => <Header title={`Practice ${concern}`} listed={listings[concern]}/>;

const useConcern = (): Maybe<Concern> => concernAt(useParams().concern);

export const ErrorBoundary: FC = () => {
  const header = useConcern().map(headerOf).orElse(null);
  return <Page header={header}><PageError/></Page>;
};

export const Room: FC = () => useConcern().either(
  concern => <Page header={headerOf(concern)}><PracticePage concern={concern}/></Page>,
  () => <NoSuchRoom/>);
