import {FC, useState} from 'react';
import {array} from '@components/arrays';
import {glide} from '@components/glide';
import {Draggable} from './Draggable';
import './styles.css';
import './styles.layout.css';

export const SortableListEagerMove: FC<{ list: Set<string>; animated?: boolean }> = ({list, animated}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const move = glide(animated ?? false);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul className='sortable-list-eager-move sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}
          style={animated ? {viewTransitionName: `eager-${item}`} : undefined}>
        <Draggable
          onDragStart={() => updateDraggedItem(item)}
          onDragOver={() => {
            if (draggedItem) {
              move(() => updateList((oldList) => array
                .moveToIndex(index, draggedItem, oldList)));
            }
          }}
          label={item}>{item}</Draggable>
      </li>)
  }</ul>;
};
