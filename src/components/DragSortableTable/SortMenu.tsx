import {FC, MouseEvent} from 'react';
import {has} from '@ryandur/sand';
import {Menu} from '@components/Menu';
import {Direction} from './sorting';

export type {Direction};

const glyphs: Record<Direction, string> = {ascending: '▲', descending: '▼'};

type Props = {
  column: string;
  sorted?: Direction;
  onRule: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const SortMenu: FC<Props> = ({column, sorted, onRule}) =>
  <Menu id={`sort-${column}`} label={`sort ${column}`}
        toggle={has(sorted) ? glyphs[sorted] : '⇅'}>
    <button type="button" className="item" onClick={event => onRule(column, 'ascending', event)}>ascending</button>
    <button type="button" className="item" onClick={event => onRule(column, 'descending', event)}>descending</button>
    <button type="button" className="item" onClick={event => onRule(column, undefined, event)}>as dealt</button>
  </Menu>;
