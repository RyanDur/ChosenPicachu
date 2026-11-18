import {FC} from 'react';
import {Location, Navigate, useLocation, useSearchParams} from 'react-router';
import {empty, Maybe, maybe} from '@ryandur/sand';
import {useHydrated} from '@components';
import {storyKeys} from '../Recipe';
import {tableTutorials} from './tutorial-pages';
import {TablePart, tableParts} from './part-pages';
import {livingStories} from './living-stories';
import {dialParams} from '../Controls';

const tutorialParam = 'tut';

const tellers = new Map<string, TablePart>([
  [livingStories.ids.still, 'the-still-table'],
  [livingStories.ids.flow, 'the-live-table-and-the-store'],
  [livingStories.ids.store, 'the-live-table-and-the-store']
]);

const tutorialNamed = (params: URLSearchParams): Maybe<string> =>
  maybe(tableTutorials.all().find(tutorial => tutorial === params.get(tutorialParam)))
    .map(tableTutorials.addressOf);

const storiesNamed = (params: URLSearchParams): string[] =>
  maybe(params.get(livingStories.param)).orElse('').split(',').filter(story => tellers.has(story));

const titleOf = (story: string): string => `#${storyKeys.anchorOf({param: livingStories.param, id: story})}`;

const storyPointedAt = (named: string[], hash: string): Maybe<string> =>
  maybe(empty(hash) ? named[0] : named.find(story => titleOf(story) === hash));

const storyMoved = (params: URLSearchParams, {pathname, hash}: Location): Maybe<string> => {
  const named = storiesNamed(params);
  return storyPointedAt(named, hash)
    .mBind(story => maybe(tellers.get(story)))
    .map(tableParts.addressOf)
    .or(() => maybe(named[0]).map(() => pathname));
};

export const ToMovedAddress: FC = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const hydrated = useHydrated();
  const dials = dialParams.keptFrom(params);
  return tutorialNamed(params).or(() => storyMoved(params, location)).either(
    pathname => hydrated && <Navigate replace to={{pathname, search: dials.toString(), hash: location.hash}}/>,
    () => null);
};
