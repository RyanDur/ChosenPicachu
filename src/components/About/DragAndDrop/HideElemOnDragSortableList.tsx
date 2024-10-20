import {cloneElement, DragEvent, FC, ReactElement, useState} from 'react';
import {Draggable, DraggableListItemProps} from './Draggable';
import {array} from '../../../helpers';
import {classNames} from '../../../util/classNames';
import './styles.css';

export const HideElemOnDragSortableList: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [dragOverIndex, updateIndex] = useState<number>(-1);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul onDrop={event => {
    event.currentTarget.blur();
  }} onDragLeave={() => updateIndex(-1)} className='sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}>
        <HideOnDrag>
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
            className='card'
          >{item}</Draggable>
        </HideOnDrag>
      </li>
    )}</ul>;
};

export const HideOnDrag: FC<{ children: ReactElement<DraggableListItemProps> }> = ({children}) => {
  const [hide, updateHide] = useState(false);
  const {className, onDragStart, onDragEnd, ...props} = children.props;

  return cloneElement(children, {
    ...props,
    className: classNames('visible', hide && 'invisible', className),
    onDragStart: (event: DragEvent<HTMLElement>) => {
      updateHide(true);
      onDragStart(event);
    },
    onDragEnd: (event: DragEvent<HTMLElement>) => {
      updateHide(false);
      onDragEnd(event);
    }
  });
};
