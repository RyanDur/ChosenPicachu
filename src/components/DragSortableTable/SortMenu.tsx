import {FC, MouseEvent} from 'react';
import {Menu} from '@components/Menu';
import {Direction, choices} from './sorting';

export type {Direction};

type Props = {
  column: string;
  onRule: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const SortMenu: FC<Props> = ({column, onRule}) =>
  <Menu id={`sort-${column}`} label={`sort ${column}`}>
    {choices.map(({display, direction}) =>
      <button type="button" className="item sub-title" key={display}
              popoverTarget={`sort-${column}`} popoverTargetAction="hide"
              onClick={event => onRule(column, direction, event)}>{display}</button>)}
  </Menu>;
