import {Maybe, nothing, some} from '@ryandur/sand';
import {SortChoice} from './sort-choices';
import {SortMenuChange} from './sort-menu-change';

export type SortMenuState = {readonly open: boolean; readonly chosen: Maybe<SortChoice>};

const initial: SortMenuState = {open: false, chosen: nothing()};

const reduce = (menu: SortMenuState, change: SortMenuChange): SortMenuState => {
  switch (change.type) {
    case 'opened': return {...menu, open: true};
    case 'closed': return {...menu, open: false};
    case 'chosen': return {open: false, chosen: some(change.choice)};
  }
};

type SortMenuModule = {
  initial: SortMenuState;
  reduce: (menu: SortMenuState, change: SortMenuChange) => SortMenuState;
};

export const sortMenu: SortMenuModule = {initial, reduce};
