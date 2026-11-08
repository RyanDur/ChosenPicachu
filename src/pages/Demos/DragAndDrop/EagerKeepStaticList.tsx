import {FC, useReducer} from 'react';
import {dragSort} from './drag-sort';
import {dragSortChange} from './drag-sort-change';
import {dragSorting} from './drag-sorting';
import {session} from './session';
import {KeepItem, MoveReport} from './items';
import './sortable-list.css';

type Props = {
  list: Set<string>;
};

export const EagerKeepStaticList: FC<Props> = ({list}) => {
  const [sort, dispatch] = useReducer(dragSort.reduce, {items: list, animated: false}, dragSort.initial);

  return <dragSorting.Provider value={[sort, dispatch]}>
    <ol aria-label="sortable list"
      onDragOver={event => event.preventDefault()}
      onDrop={event => event.preventDefault()}
      className="sortable-list card rounded-corners lifted padded contained">{
        sort.order.map((item, index) =>
          <KeepItem key={item} item={item}
            className="item"
            onDragOver={session.crossingOver(sort.held, sort.order)(item, index, homeward =>
              dispatch(dragSortChange.crossed(index, homeward)))}/>)
      }</ol>
    <MoveReport/>
  </dragSorting.Provider>;
};
