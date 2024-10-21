import {FC, useState} from 'react';
import {Draggable, DraggableListItemProps} from './Draggable';
import {array} from '../../../helpers';
import {classNames} from '../../../util/classNames';
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
      onDragEnd?.(event);
      updateHide(undefined);
    }}
    onDragStart={(event) => {
      onDragStart?.(event);
      updateHide('hide');
    }}
    label={label}
  >{children}</Draggable>;
};
