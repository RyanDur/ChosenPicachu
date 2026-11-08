import {Entry, Item, Menu} from '@components/Menu';
import {FC} from 'react';
import {tableActions, sorting} from './model';
import {useHeaderEvents} from './useHeaderEvents';
import {useTableDispatch} from './useTableDispatch';
import {useHydrated} from '@frame/state';

export const SortMenu: FC<{column: string}> = ({column}) => {
  const {onSorted} = useHeaderEvents();
  const dispatch = useTableDispatch();
  const hydrated = useHydrated();

  return <>
    <button type="button" tabIndex={0} disabled={!hydrated} className="menu-toggle rounded-corners borderless unfilled muted-ink attentive"
      popoverTarget={`sort-${column}`}
      onPointerDown={event => event.stopPropagation()}
      aria-label={`sort ${column}`}/>
    <Menu id={`sort-${column}`} tabIndex={-1} popover="auto" className="card rounded-corners lifted" aria-label={`sort ${column} by`}
      onPointerDown={event => event.stopPropagation()}>
      {sorting.choices.map(choice =>
        <Entry key={choice}>
          <Item tabIndex={0} className="sub-title"
            popoverTarget={`sort-${column}`} popoverTargetAction="hide"
            onClick={() => {
              const direction = sorting.directionOf(choice);
              onSorted?.({column, direction});
              dispatch(tableActions.sortChosen(column, direction));
            }}>{choice}</Item>
        </Entry>)}
    </Menu>
  </>;
};
