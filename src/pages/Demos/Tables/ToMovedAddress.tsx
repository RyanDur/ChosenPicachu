import {FC} from 'react';
import {Navigate, useLocation, useSearchParams} from 'react-router';
import {Maybe, maybe} from '@ryandur/sand';
import {useHydrated} from '@components';
import {tableTutorials} from './tutorial-pages';
import {TablePart, tableParts} from './part-pages';
import {livingStories} from './living-stories';

const tutorialParam = 'tut';

const tellers = new Map<string, TablePart>([
  [livingStories.ids.still, 'the-still-table'],
  [livingStories.ids.flow, 'the-live-table-and-the-store'],
  [livingStories.ids.store, 'the-live-table-and-the-store']
]);

const tutorialNamed = (params: URLSearchParams): Maybe<string> =>
  maybe(tableTutorials.all().find(tutorial => tutorial === params.get(tutorialParam))).map(tableTutorials.addressOf);

const partTellingFirst = (params: URLSearchParams): Maybe<string> =>
  maybe(maybe(params.get(livingStories.param)).orElse('').split(',').find(story => tellers.has(story)))
    .mBind(story => maybe(tellers.get(story)))
    .map(tableParts.addressOf);

export const ToMovedAddress: FC = () => {
  const [params] = useSearchParams();
  const {hash} = useLocation();
  const hydrated = useHydrated();
  const dials = new URLSearchParams(params);
  dials.delete(tutorialParam);
  dials.delete(livingStories.param);
  return tutorialNamed(params).or(() => partTellingFirst(params)).either(
    pathname => hydrated && <Navigate replace to={{pathname, search: dials.toString(), hash}}/>,
    () => null);
};
