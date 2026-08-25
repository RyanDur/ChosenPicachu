import {FC, MouseEvent} from 'react';
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
            aria-label={`sort ${column}`}/>
    <menu id={`sort-${column}`} popover="auto" className="menu card rounded-corners lifted"
          onPointerDown={event => event.stopPropagation()}>
      {choices.map(({display, direction}) =>
        <li className="entry" key={display}>
          <button type="button" className="item sub-title"
                  popoverTarget={`sort-${column}`} popoverTargetAction="hide"
                  onClick={event => onRule(column, direction, event)}>{display}</button>
        </li>)}
    </menu>
  </>;
