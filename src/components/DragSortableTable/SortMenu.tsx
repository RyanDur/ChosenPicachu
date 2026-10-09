import {Entry, Item, Menu} from '@components/Menu';
import {FC} from 'react';
import {choices} from './sorting';
import {useHeaderEvents, useTableDispatch} from './context';
import {sortChosen} from './actions';

export const SortMenu: FC<{column: string}> = ({column}) => {
  const {onSorted} = useHeaderEvents();
  const dispatch = useTableDispatch();

  return <>
    <button type="button" tabIndex={0} className="menu-toggle rounded-corners borderless unfilled muted-ink attentive"
      popoverTarget={`sort-${column}`}
      onPointerDown={event => event.stopPropagation()}
      aria-label={`sort ${column}`}/>
    <Menu id={`sort-${column}`} tabIndex={-1} popover="auto" className="card rounded-corners lifted" aria-label={`sort ${column} by`}
      onPointerDown={event => event.stopPropagation()}>
      {choices.map(({display, direction}) =>
        <Entry key={display}>
          <Item tabIndex={0} className="sub-title"
            popoverTarget={`sort-${column}`} popoverTargetAction="hide"
            onClick={() => {
              onSorted?.({column, direction});
              dispatch(sortChosen(column, direction));
            }}>{display}</Item>
        </Entry>)}
    </Menu>
  </>;
};
