import {FC} from 'react';
import {classNames} from '@components';
import {dragSortChange} from '../drag-sort-change';
import {useDragSort} from '../useDragSort';
import {useDragSortDispatch} from '../useDragSortDispatch';
import {ItemProps} from './props';
import {Grip} from './Grip';
import '../Item.css';
import './HideItem.css';

export const HideItem: FC<ItemProps> = ({item, className, onDragOver, ...li}) => {
  const {held, gripped} = useDragSort();
  const dispatch = useDragSortDispatch();

  return <li {...li}
    className={classNames('draggable', 'soft-cornered', 'field', 'hairline-outline', 'handle-raised',
      held.map(lifted => lifted === item).orElse(false) && 'hide', className)}
    onDragStart={event => {
      event.dataTransfer.effectAllowed = 'move';
      dispatch(dragSortChange.lifted(item));
    }}
    onDragOver={event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      onDragOver?.(event);
    }}
    onDrop={event => event.preventDefault()}
    onDragEnd={() => dispatch(dragSortChange.released())}
    draggable={gripped.map(pressed => pressed === item).orElse(false)}>
    <Grip item={item}/>
    <span className="value display-figure">{item}</span>
  </li>;
};
