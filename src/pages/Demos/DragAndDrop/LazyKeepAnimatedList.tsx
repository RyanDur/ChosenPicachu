import {FC, useReducer} from 'react';
import {classNames} from '@components';
import {dragSort} from './drag-sort';
import {dragSortChange} from './drag-sort-change';
import {dragSorting} from './drag-sorting';
import {slideStarts} from './slide-starts';
import {KeepItem, MoveReport} from './items';
import './sortable-list.css';

type Props = {
  list: Set<string>;
};

export const LazyKeepAnimatedList: FC<Props> = ({list}) => {
  const [sort, dispatch] = useReducer(dragSort.reduce, {items: list, animated: true}, dragSort.initial);

  return <dragSorting.Provider value={[sort, dispatch]}>
    <ol aria-label="sortable list"
      onDragOver={event => event.preventDefault()}
      onDrop={event => event.preventDefault()}
      onDragLeave={() => dispatch(dragSortChange.left())}
      className="sortable-list lazy-paced card rounded-corners lifted padded contained">{
        sort.order.map((item, index) => {
          const slideStart = slideStarts.of(sort.slideStarts, item);
          return <KeepItem key={item} item={item}
            onDragOver={() => dispatch(dragSortChange.hovered(index))}
            className={classNames('item', slideStart.map(({again}) => again ? 'sliding-in-again' : 'sliding-in').orElse(''))}
            style={slideStart.map(({places}) => ({'--starts-places-right': places})).orElse({})}
            onAnimationEnd={() => dispatch(dragSortChange.slid(item))}/>;
        })
      }</ol>
    <MoveReport/>
  </dragSorting.Provider>;
};
