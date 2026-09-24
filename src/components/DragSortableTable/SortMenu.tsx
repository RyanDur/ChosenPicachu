import {FC} from 'react';
import {choices} from './sorting';
import {useHeaderEvents, useTableDispatch} from './context';
import {reported} from './actions';

export const SortMenu: FC<{column: string}> = ({column}) => {
  const {onSorted} = useHeaderEvents();
  const dispatch = useTableDispatch();

  return <>
    <button type="button" tabIndex={0} className="menu-toggle rounded-corners"
      popoverTarget={`sort-${column}`}
      onPointerDown={event => event.stopPropagation()}
      aria-label={`sort ${column}`}/>
    <menu id={`sort-${column}`} tabIndex={-1} popover="auto" className="menu card rounded-corners lifted" aria-label={`sort ${column} by`}
      onPointerDown={event => event.stopPropagation()}>
      {choices.map(({display, direction}) =>
        <li className="entry" key={display}>
          <button type="button" tabIndex={0} className="item sub-title"
            popoverTarget={`sort-${column}`} popoverTargetAction="hide"
            onClick={() => {
              onSorted?.({column, direction});
              dispatch(reported({about: 'sort', name: column, direction}));
            }}>{display}</button>
        </li>)}
    </menu>
  </>;
};
