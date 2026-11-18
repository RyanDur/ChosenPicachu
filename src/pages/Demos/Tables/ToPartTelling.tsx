import {FC} from 'react';
import {Navigate, useLocation, useSearchParams} from 'react-router';
import {maybe} from '@ryandur/sand';
import {useHydrated} from '@components';
import {TablePart, tableParts} from './part-pages';
import {livingStories} from './living-stories';

const tellers: Record<string, TablePart> = {
  [livingStories.ids.still]: 'the-still-table',
  [livingStories.ids.flow]: 'the-live-table-and-the-store',
  [livingStories.ids.store]: 'the-live-table-and-the-store'
};

export const ToPartTelling: FC = () => {
  const [params] = useSearchParams();
  const {hash} = useLocation();
  const hydrated = useHydrated();
  const named = (params.get(livingStories.param) ?? '').split(',');
  const dials = new URLSearchParams(params);
  dials.delete(livingStories.param);
  return maybe(Object.entries(tellers).find(([story]) => named.includes(story))).either(
    ([, part]) => hydrated &&
      <Navigate replace to={{pathname: tableParts.addressOf(part), search: dials.toString(), hash}}/>,
    () => null);
};
