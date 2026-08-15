import {FC, MouseEvent} from 'react';
import {has} from '@ryandur/sand';
import {Menu} from '@components/Menu';
import {Direction, glyphs, unsorted} from './sorting';

export type {Direction};

type Props = {
  column: string;
  sorted?: Direction;
  onRule: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const SortMenu: FC<Props> = ({column, sorted, onRule}) =>
  <Menu id={`sort-${column}`} label={`sort ${column}`}
        toggle={has(sorted) ? glyphs[sorted] : unsorted}>
    <button type="button" className="item sub-title" onClick={event => onRule(column, 'ascending', event)}>ascending</button>
    <button type="button" className="item sub-title" onClick={event => onRule(column, 'descending', event)}>descending</button>
    <button type="button" className="item sub-title" onClick={event => onRule(column, undefined, event)}>as dealt</button>
  </Menu>;
