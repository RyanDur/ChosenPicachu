import {FC, useState} from 'react';
import {array} from '@components/arrays';
import {HideOnDrag} from './HideOnDrag';
import './styles.css';
import './styles.layout.css';

export const HideElemOnDragSortableListEagerMove: FC<{ list: Set<string>; animated?: boolean }> = ({list, animated}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul
    onDragOver={event => event.preventDefault()}
    onDrop={event => event.preventDefault()}
    className='hide-elem-on-drag-sortable-list-eager-move sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}>
        <HideOnDrag
          onDragStart={() => updateDraggedItem(item)}
          onDragEnd={() => updateDraggedItem(undefined)}
          onDragOver={event => {
            if (draggedItem && draggedItem !== item) {
              const overtaken = event.currentTarget;
              const held = overtaken.getBoundingClientRect().top;
              updateList((oldList) => array.moveToIndex(index, draggedItem, oldList));
              if (animated) {
                requestAnimationFrame(() => {
                  const landed = overtaken.getBoundingClientRect().top;
                  overtaken.animate(
                    [{transform: `translateY(${held - landed}px)`}, {transform: 'none'}],
                    {duration: 150, easing: 'ease-out'});
                });
              }
            }
          }}
          label={item}
        >{item}</HideOnDrag>
      </li>
    )}</ul>;
};

