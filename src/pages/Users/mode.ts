import {createSearchParams} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import {User} from '@components/Users/UserInfo/user';

export type Opened =
  | {readonly mode: 'adding'; readonly copying?: User}
  | {readonly mode: 'viewing'; readonly user: User}
  | {readonly mode: 'editing'; readonly user: User};

export const openedOn = (param: string | undefined, chosen: Maybe<User>): Opened => chosen
  .map((user): Opened => {
    switch (param) {
      case 'view': return {mode: 'viewing', user};
      case 'edit': return {mode: 'editing', user};
      default: return {mode: 'adding', copying: user};
    }
  })
  .orElse({mode: 'adding'});

export const userAt = (id: string, mode: 'view' | 'edit'): string =>
  `${Paths.users}?${createSearchParams({id, mode})}`;
