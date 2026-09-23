import {FC, useState} from 'react';
import {classNames} from '@components/class-names';
import {ItemProps} from './props';
import {Grip} from './Grip';
import '../Item.css';

export const HideItem: FC<ItemProps> = (
  {item, order, className, onLifted, onReleased, onDragOver, onArranged, ...li}
) => {
  const [dragging, updateDragging] = useState(false);
  const [hide, updateHide] = useState(false);

  return <li {...li}
    className={classNames('draggable', hide && 'hide', className)}
    onDragStart={event => {
      event.dataTransfer.effectAllowed = 'move';
      updateHide(true);
      onLifted(item);
    }}
    onDragOver={event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      onDragOver?.(event);
    }}
    onDrop={event => event.preventDefault()}
    onDragEnd={() => {
      updateHide(false);
      onReleased();
      updateDragging(false);
    }}
    draggable={dragging}>
    <Grip item={item} order={order} onArm={() => updateDragging(true)} onArranged={onArranged}/>
    <span className="value">{item}</span>
  </li>;
};
