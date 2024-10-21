import {FC, useState} from 'react';
import {array} from '../../../helpers';
import {HideOnDrag} from './HideOnDrag';
import './styles.css';
import './styles.layout.css';

export const SlideElemOnDragSortableList: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul
    className='sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}>
        <HideOnDrag
          onDragStart={() => updateDraggedItem(item)}
          onDragOver={() => {
            if (draggedItem) {
              updateList((oldList) => array
                .moveToIndex(index, draggedItem, oldList));
            }
          }}
          label={item}
        >{item}</HideOnDrag>
      </li>
    )}</ul>;
};

