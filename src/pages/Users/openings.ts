import {createSearchParams} from 'react-router';
import * as schema from 'schemawax';
import {Maybe} from '@ryandur/sand';
import {Paths} from '@frame/navigation';
import {User} from './profile';

export type Opened =
  | {readonly mode: 'adding'; readonly copying?: User}
  | {readonly mode: 'viewing'; readonly user: User}
  | {readonly mode: 'editing'; readonly user: User};

export type Mode = 'view' | 'edit';

type Openings = {
  param: schema.Decoder<Mode>;
  of: (chosen: Maybe<User>, param?: Mode) => Opened;
  at: (id: string, mode: Mode) => string;
  copying: (id: string) => string;
};

export const openings: Openings = {
  param: schema.literalUnion('view', 'edit'),
  of: (chosen, param) => chosen
    .map((user): Opened => {
      switch (param) {
        case 'view': return {mode: 'viewing', user};
        case 'edit': return {mode: 'editing', user};
        default: return {mode: 'adding', copying: user};
      }
    })
    .orElse({mode: 'adding'}),
  at: (id, mode) => `${Paths.users}?${createSearchParams({id, mode})}`,
  copying: id => `${Paths.users}?${createSearchParams({id})}`
};
