import {FC, useState} from 'react';
import {array} from '@components/arrays';
import {glide} from '@components/glide';
import {HideOnDrag} from './HideOnDrag';
import './styles.css';
import './styles.layout.css';

export const HideElemOnDragSortableListEagerMove: FC<{ list: Set<string>; animated?: boolean }> = ({list, animated}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const move = glide(animated ?? false);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul
    onDragOver={event => event.preventDefault()}
    onDrop={event => event.preventDefault()}
    className='hide-elem-on-drag-sortable-list-eager-move sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}
          style={animated && item !== draggedItem ? {viewTransitionName: `hide-eager-${item}`} : undefined}>
        <HideOnDrag
          onDragStart={() => updateDraggedItem(item)}
          onDragEnd={() => updateDraggedItem(undefined)}
          onDragOver={() => {
            if (draggedItem) {
              move(() => updateList((oldList) => array
                .moveToIndex(index, draggedItem, oldList)));
            }
          }}
          label={item}
        >{item}</HideOnDrag>
      </li>
    )}</ul>;
};

