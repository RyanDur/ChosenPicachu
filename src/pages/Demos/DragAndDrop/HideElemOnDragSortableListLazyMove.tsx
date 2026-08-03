import {FC, useState} from 'react';
import {array} from '@components/arrays';
import {glide} from '@components/glide';
import {HideOnDrag} from './HideOnDrag';
import './styles.css';
import './styles.layout.css';

export const HideElemOnDragSortableListLazyMove: FC<{ list: Set<string>; animated?: boolean }> = ({list, animated}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const move = glide(animated ?? false);
  const [dragOverIndex, updateIndex] = useState<number>(-1);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul onDragLeave={() => updateIndex(-1)}
             onDragOver={event => event.preventDefault()}
             onDrop={event => event.preventDefault()}
             className='hide-elem-on-drag-sortable-list-lazy-move sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}
          style={animated && item !== draggedItem ? {viewTransitionName: `hide-lazy-${item}`} : undefined}>
        <HideOnDrag
          onDragEnd={() => {
            if (draggedItem && dragOverIndex >= 0) {
              move(() => updateList((oldList) => array
                .moveToIndex(dragOverIndex, draggedItem, oldList)));
            }
            updateDraggedItem(undefined);
          }}
          onDragStart={() => updateDraggedItem(item)}
          onDragOver={() => updateIndex(index)}
          label={item}
        >{item}</HideOnDrag>
      </li>
    )}</ul>;
};
