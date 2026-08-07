import {FC, useState} from 'react';
import {classNames} from '@components/class-names';
import {Draggable, DraggableProps} from './Draggable';
import './HideOnDrag.css';

export const HideOnDrag: FC<DraggableProps> = ({className, onLifted, onReleased, ...rest}) => {
  const [hide, updateHide] = useState<'hide'>();

  return <Draggable
    {...rest}
    className={classNames(hide, className)}
    onLifted={item => {
      updateHide('hide');
      onLifted(item);
    }}
    onReleased={() => {
      updateHide(undefined);
      onReleased();
    }}/>;
};
