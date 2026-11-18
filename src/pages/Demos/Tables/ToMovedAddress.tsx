import {FC} from 'react';
import {Location, Navigate, Path, useLocation, useSearchParams} from 'react-router';
import {empty, Maybe, maybe} from '@ryandur/sand';
import {useHydrated} from '@components';
import {tableTutorials} from './tutorial-pages';
import {TablePart, tableParts} from './part-pages';
import {livingStories} from './living-stories';
import {readerSettings} from '../ReaderSettings';

const tutorialParam = 'tut';

const tellers = new Map<string, TablePart>([
  [livingStories.ids.still, 'the-still-table'],
  [livingStories.ids.flow, 'the-live-table-and-the-store'],
  [livingStories.ids.store, 'the-live-table-and-the-store']
]);

type Moved = Omit<Path, 'hash'>;

const carrying = (params: URLSearchParams, ...alsoRead: string[]) => (pathname: string): Moved =>
  ({pathname, search: readerSettings.keptFrom(params, ...alsoRead).toString()});

const pageForNamedTutorial = (params: URLSearchParams): Maybe<Moved> =>
  maybe(tableTutorials.all().find(tutorial => tutorial === params.get(tutorialParam)))
    .map(tutorial => carrying(params, tutorial)(tableTutorials.addressOf(tutorial)));

const pageTelling = (story: string): Maybe<string> => maybe(tellers.get(story)).map(tableParts.addressOf);

const fragmentOf = (story: string): string => `#${livingStories.titleIdOf(story)}`;

const pageForFragment = (hash: string): Maybe<string> =>
  maybe([...tellers.keys()].find(story => fragmentOf(story) === hash)).mBind(pageTelling);

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
    .or(() => pageForNamedStory(params, location).map(carrying(params)))
    .either(
      moved => hydrated && <Navigate replace to={{...moved, hash: location.hash}}/>,
      () => null);
};
