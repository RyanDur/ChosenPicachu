import {FC} from 'react';
import {Location, Navigate, Path, useLocation, useSearchParams} from 'react-router';
import {empty, Maybe, maybe} from '@ryandur/sand';
import {useHydrated} from '@components';
import {tableTutorials} from './tutorial-pages';
import {TablePart, tableParts} from './part-pages';
import {livingStories} from './living-stories';
import {readerSettings} from '../ReaderSettings';
import {stations} from '../headings';
import {featuresId} from './features-id';

const tutorialParam = 'tut';

const tellers = new Map<string, TablePart>([
  [livingStories.ids.still, 'the-still-table'],
  [livingStories.ids.flow, 'the-live-table-and-the-store'],
  [livingStories.ids.store, 'the-live-table-and-the-store']
]);

type Moved = Omit<Path, 'hash'> & {hash?: string};

const carrying = (params: URLSearchParams) => (pathname: string): Moved =>
  ({pathname, search: readerSettings.keptFrom(params).toString()});

const pageForNamedTutorial = (params: URLSearchParams): Maybe<Moved> =>
  maybe(tableTutorials.all().find(tutorial => tutorial === params.get(tutorialParam)))
    .map(tutorial => carrying(params)(tableTutorials.addressOf(tutorial)));

const pageTelling = (story: string): Maybe<string> => maybe(tellers.get(story)).map(tableParts.addressOf);

const fragmentOf = (story: string): string => `#${livingStories.titleIdOf(story)}`;

const pageForFragment = (hash: string): Maybe<string> =>
  maybe([...tellers.keys()].find(story => fragmentOf(story) === hash)).mBind(pageTelling);

type StationPlace = {pathname: string; hash: string};

const stationed = new Map<string, StationPlace>([
  ...tableParts.inOrder.map((part, index): [string, StationPlace] =>
    [`#${stations.idOf(index + 1)}`, {pathname: tableParts.addressOf(part), hash: ''}]),
  [`#${stations.idOf(tableParts.count + 1)}`, {pathname: tableParts.tabAddress, hash: `#${featuresId}`}]
]);

const placeForStation = (params: URLSearchParams, hash: string): Maybe<Moved> =>
  maybe(stationed.get(hash)).map(({pathname, hash: place}) => ({...carrying(params)(pathname), hash: place}));

const storiesNamed = (params: URLSearchParams): string[] =>
  maybe(params.get(livingStories.param)).orElse('').split(',').filter(story => tellers.has(story));

const pageForNamedStory = (params: URLSearchParams, {pathname, hash}: Location): Maybe<string> =>
  maybe(storiesNamed(params)[0]).mBind(first => empty(hash) ? pageTelling(first) : maybe(pathname));

export const ToMovedAddress: FC = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const hydrated = useHydrated();
  return pageForFragment(location.hash).map(carrying(params))
    .or(() => pageForNamedTutorial(params))
    .or(() => placeForStation(params, location.hash))
    .or(() => pageForNamedStory(params, location).map(carrying(params)))
    .either(
      moved => hydrated && <Navigate replace to={{hash: location.hash, ...moved}}/>,
      () => null);
};
