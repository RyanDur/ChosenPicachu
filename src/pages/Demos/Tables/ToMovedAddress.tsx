import {FC} from 'react';
import {Location, Navigate, useLocation, useSearchParams} from 'react-router';
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

const pageForNamedTutorial = (params: URLSearchParams): Maybe<string> =>
  maybe(tableTutorials.all().find(tutorial => tutorial === params.get(tutorialParam)))
    .map(tableTutorials.addressOf);

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
  const dials = readerSettings.keptFrom(params);
  return pageForFragment(location.hash)
    .or(() => pageForNamedTutorial(params))
    .or(() => pageForNamedStory(params, location))
    .either(
      pathname => hydrated && <Navigate replace to={{pathname, search: dials.toString(), hash: location.hash}}/>,
      () => null);
};
