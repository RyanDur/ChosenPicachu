import {FC} from 'react';
import {choices} from './sorting';
import {has} from '@ryandur/sand';
import {reset, ruledBy} from './actions';
import {useTableDispatch, useTableSelector} from './context';
import {selectArrival} from './selectors';

export const SortMenu: FC<{column: string}> = ({column}) => {
  const dispatch = useTableDispatch();
  const arrival = useTableSelector(selectArrival);

  return <>
    <button type="button" className="menu-toggle rounded-corners"
            popoverTarget={`sort-${column}`}
            onPointerDown={event => event.stopPropagation()}
            aria-label={`sort ${column}`}/>
    <menu id={`sort-${column}`} tabIndex={-1} popover="auto" className="menu card rounded-corners lifted" aria-label={`sort ${column} by`}
          onPointerDown={event => event.stopPropagation()}>
      {choices.map(({display, direction}) =>
        <li className="entry" key={display}>
          <button type="button" className="item sub-title"
                  popoverTarget={`sort-${column}`} popoverTargetAction="hide"
                  onClick={() => dispatch(has(direction) ? ruledBy(column, direction) : reset(arrival))}>{display}</button>
        </li>)}
    </menu>
  </>;
};
