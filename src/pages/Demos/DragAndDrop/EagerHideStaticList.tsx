import {FC, useReducer} from 'react';
import {dragSort} from './drag-sort';
import {dragSortChange} from './drag-sort-change';
import {dragSorting} from './drag-sorting';
import {crossing} from './crossing';
import {HideItem, MoveReport} from './items';
import './sortable-list.css';

type Props = {
  list: Set<string>;
};

export const EagerHideStaticList: FC<Props> = ({list}) => {
  const [sort, dispatch] = useReducer(dragSort.reduce, {items: list, animated: false}, dragSort.initial);

  return <dragSorting.Provider value={[sort, dispatch]}>
    <ol aria-label="sortable list"
      onDragOver={event => event.preventDefault()}
      onDrop={event => event.preventDefault()}
      className="sortable-list card rounded-corners lifted padded contained">{
        sort.order.map((item, index) =>
          <HideItem key={item} item={item}
            className="item"
            onDragOver={crossing.crossingOver(sort.held, sort.order)(item, index, homeward =>
              dispatch(dragSortChange.crossed(index, homeward)))}/>)
      }</ol>
    <MoveReport/>
  </dragSorting.Provider>;
};
