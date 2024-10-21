import {FC, useState} from 'react';
import {Draggable, DraggableListItemProps} from './Draggable';
import {array} from '../../../helpers';
import {classNames} from '../../../util/classNames';
import './styles.css';
import './styles.layout.css';

export const HideElemOnDragSortableList: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [dragOverIndex, updateIndex] = useState<number>(-1);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <ul onDragLeave={() => updateIndex(-1)} className='sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}>
        <HideOnDrag
          onDragEnd={() => {
            if (draggedItem && dragOverIndex >= 0) {
              updateList((oldList) => array
                .moveToIndex(dragOverIndex, draggedItem, oldList));
            }
          }}
          onDragStart={() => updateDraggedItem(item)}
          onDragOver={() => updateIndex(index)}
          label={item}
        >{item}</HideOnDrag>
      </li>
    )}</ul>;
};

const HideOnDrag: FC<DraggableListItemProps> = ({
  children,
  className,
  label,
  onDragStart,
  onDragEnd,
  ...rest
}) => {
  const [hide, updateHide] = useState<'hide'>();

  return <Draggable
    {...rest}
    className={classNames(hide, className)}
    onDragEnd={(event) => {
      onDragEnd(event);
      updateHide(undefined);
    }}
    onDragStart={(event) => {
      onDragStart(event);
      updateHide('hide');
    }}
    label={label}
  >{children}</Draggable>;
};
