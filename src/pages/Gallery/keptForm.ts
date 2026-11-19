import {useState} from 'react';
import {NavigationType, useLocation, useNavigationType} from 'react-router';
import {maybe} from '@ryandur/sand';
import * as schema from 'schemawax';

type Form = 'search' | 'pages';

type Moves = {readonly locationKey: string; readonly moves: number};

const keptKeys = schema.object({optional: {search: schema.string, pages: schema.string}});

const paramsOf: Record<Form, string[]> = {search: ['search'], pages: ['page', 'size']};

const addressKeyOf = (form: Form, search: string): string => {
  const params = new URLSearchParams(search);
  return paramsOf[form].map(param => params.get(param) ?? '').join(' ');
};

const useMoves = (): number => {
  const {key} = useLocation();
  const moved = useNavigationType() !== NavigationType.Replace;
  const [seen, setSeen] = useState<Moves>({locationKey: key, moves: 0});
  const now = key === seen.locationKey ? seen : {locationKey: key, moves: moved ? seen.moves + 1 : seen.moves};
  if (now !== seen) setSeen(now);
  return now.moves;
};

export const keptForm = {
  across: (form: Form, key: string): Partial<Record<Form, string>> => ({[form]: key}),
  useKey: (form: Form): string => {
    const {state, search} = useLocation();
    const moves = useMoves();
    return maybe(keptKeys.decode(state)).mBind(kept => maybe(kept[form]))
      .orElse(`${addressKeyOf(form, search)} ${moves}`);
  }
};
