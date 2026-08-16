import {FC, MouseEvent} from 'react';
import {Menu} from '@components/Menu';
import {Direction, choices, glyphOf} from './sorting';

export type {Direction};

type Props = {
  column: string;
  sorted?: Direction;
  onRule: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const SortMenu: FC<Props> = ({column, sorted, onRule}) =>
  <Menu id={`sort-${column}`} label={`sort ${column}`}
        toggle={glyphOf(sorted)}>
    {choices.map(({display, direction}) =>
      <button type="button" className="item sub-title" key={display}
              onClick={event => onRule(column, direction, event)}>{display}</button>)}
  </Menu>;
