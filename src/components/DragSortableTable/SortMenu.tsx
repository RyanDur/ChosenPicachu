import {FC} from 'react';
import {useColumn} from '@components/Table';
import {Direction, choices} from './sorting';

export type {Direction};

export const SortMenu: FC = () => {
  const {name, onRule} = useColumn();

  return <>
    <button type="button" className="menu-toggle rounded-corners"
            popoverTarget={`sort-${name}`}
            onPointerDown={event => event.stopPropagation()}
            aria-label={`sort ${name}`}/>
    <menu id={`sort-${name}`} popover="auto" className="menu card rounded-corners lifted"
          onPointerDown={event => event.stopPropagation()}>
      {choices.map(({display, direction}) =>
        <li className="entry" key={display}>
          <button type="button" className="item sub-title"
                  popoverTarget={`sort-${name}`} popoverTargetAction="hide"
                  onClick={event => onRule(direction, event)}>{display}</button>
        </li>)}
    </menu>
  </>;
};
