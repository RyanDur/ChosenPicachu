import {FC, MouseEvent} from 'react';
import {Menu} from '@components/Menu';
import {Direction, choices} from './sorting';

export type {Direction};

type Props = {
  column: string;
  onRule: (column: string, direction: Direction | undefined, event: MouseEvent<HTMLButtonElement>) => void;
};

export const SortMenu: FC<Props> = ({column, onRule}) =>
  <>
    <button type="button" className="menu-toggle rounded-corners"
            popoverTarget={`sort-${column}`}
            onPointerDown={event => event.stopPropagation()}
            onMouseDown={event => event.stopPropagation()}
            aria-label={`sort ${column}`}/>
    <Menu id={`sort-${column}`}>
      {choices.map(({display, direction}) =>
        <button type="button" className="item sub-title" key={display}
                popoverTarget={`sort-${column}`} popoverTargetAction="hide"
                onClick={event => onRule(column, direction, event)}>{display}</button>)}
    </Menu>
  </>;
