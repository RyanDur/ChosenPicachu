import {FC, ReactElement} from 'react';
import {useParams} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Header, Listing, Main, PageError} from '@page';
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

type AddressedConcern = {
  whenShown: (show: (concern: Concern) => ReactElement) => ReactElement | null;
  shownOr: (show: (concern: Concern) => ReactElement, notShown: () => ReactElement) => ReactElement;
};

const addressed = (concern: Maybe<Concern>): AddressedConcern => ({
  whenShown: show => concern.map(show).orNull(),
  shownOr: (show, notShown) => concern.either(show, notShown)
});

const useAddressedConcern = (): AddressedConcern =>
  addressed(practiceAddress.concernFromSegment(useParams().concern));

const ConcernHeader: FC = () => useAddressedConcern().whenShown(concern =>
  <Header pageName={`Practice ${concern}`} listed={listings[concern]}/>);

export const ErrorBoundary: FC = () => <><ConcernHeader/><Main><PageError/></Main></>;

export const Room: FC = () => useAddressedConcern().shownOr(
  concern => <><ConcernHeader/><Main><PracticePage concern={concern}/></Main></>,
  () => <NoSuchRoom/>);
