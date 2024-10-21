import {FC, useState} from 'react';
import {Draggable, DraggableListItemProps} from './Draggable';
import {classNames} from '../../../util/classNames';

export const HideOnDrag: FC<DraggableListItemProps> = ({
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
