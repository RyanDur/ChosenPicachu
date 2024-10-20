import {FC, useState} from 'react';
import {Draggable} from './Draggable';
import {array} from '../../../helpers';
import {classNames} from '../../../util/classNames';
import './styles.css';
import './styles.layout.css';

export const HideElemOnDragSortableList: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [dragOverIndex, updateIndex] = useState<number>(-1);
  const [draggedItem, updateDraggedItem] = useState<string>();
  const [hide, updateHide] = useState(false);

  return <ul onDrop={event => {
    event.currentTarget.blur();
  }} onDragLeave={() => updateIndex(-1)} className='sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}>
        <Draggable
          className={classNames('visible', hide && 'invisible')}
          onDragEnd={() => {
            updateHide(false);
            if (draggedItem && dragOverIndex >= 0) {
              updateList((oldList) => array
                .moveToIndex(dragOverIndex, draggedItem, oldList));
            }
          }}
          onDragStart={() => {
            updateHide(true);
            updateDraggedItem(item);
          }}
          onDragOver={() => {
            updateIndex(index);
          }}
          label={item}
        >{item}</Draggable>
      </li>
    )}</ul>;
};
