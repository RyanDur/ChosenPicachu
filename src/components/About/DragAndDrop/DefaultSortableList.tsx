import {FC, useState} from 'react';
import {array} from '../../../helpers';
import {Draggable} from './Draggable';
import './styles.css';

export const DefaultSortableList: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [dragOverIndex, updateIndex] = useState<number>(-1);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul onDragLeave={() => updateIndex(-1)} className='sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}>
        <Draggable
          onDragEnd={() => {
            if (draggedItem && dragOverIndex >= 0) {
              updateList((oldList) => array
                .moveToIndex(dragOverIndex, draggedItem, oldList));
            }
          }}
          onDragStart={() => updateDraggedItem(item)}
          onDragOver={() => updateIndex(index)}
          label={item}
          className='card'>{item}</Draggable>
      </li>)
  }</ul>;
};
