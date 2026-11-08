import {FC, useReducer} from 'react';
import {classNames} from '@components';
import {dragSort} from '../drag-sort';
import {dragSortChange} from '../drag-sort-change';
import {dragSorting} from '../drag-sorting';
import {crossing} from '../crossing';
import {slideStarts} from '../slide-starts';
import {KeepItem, MoveReport} from '../items';
import '../sortable-list.css';
import './EagerKeepAnimatedList.css';

type Props = {
  list: Set<string>;
};

export const EagerKeepAnimatedList: FC<Props> = ({list}) => {
  const [sort, dispatch] = useReducer(dragSort.reduce, {items: list, animated: true}, dragSort.initial);

  return <dragSorting.Provider value={[sort, dispatch]}>
    <ol aria-label="sortable list"
      onDragOver={event => event.preventDefault()}
      onDrop={event => event.preventDefault()}
      className="sortable-list card rounded-corners lifted padded contained">{
        sort.order.map((item, index) => {
          const slideStart = slideStarts.of(sort.slideStarts, item);
          return <KeepItem key={item} item={item}
            className={classNames('item', slideStart.map(() => 'sliding-in').orElse(''))}
            style={slideStart.map(places => ({'--starts-places-right': places})).orElse({})}
            onAnimationEnd={() => dispatch(dragSortChange.slid())}
            onDragOver={crossing.crossingOver(sort.held, sort.order)(item, index, homeward =>
              dispatch(dragSortChange.crossed(index, homeward)))}/>;
        })
      }</ol>
    <MoveReport/>
  </dragSorting.Provider>;
};
