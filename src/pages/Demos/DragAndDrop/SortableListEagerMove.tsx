import {FC, useState} from 'react';
import {array} from '@components/arrays';
import {flushSync} from 'react-dom';
import {Draggable} from './Draggable';
import {PillGlider} from '@components/PillGlider';
import './styles.css';
import './styles.layout.css';

export const SortableListEagerMove: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [motion, updateMotion] = useState<'animated' | 'static'>('static');
  const animated = motion === 'animated';
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <>
    <PillGlider label="eager animation style"
                name="eager-animate-or-static"
                options={[
                  {display: 'Animate', value: 'animated'},
                  {display: 'Static', value: 'static'}
                ]}
                chosen={motion}
                onChoose={updateMotion}/>
    <ul onDragOver={event => event.preventDefault()}
             onDrop={event => event.preventDefault()}
             className='sortable-list-eager-move sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}>
        <Draggable
          onDragStart={() => updateDraggedItem(item)}
          onDragEnd={() => updateDraggedItem(undefined)}
          onDragOver={event => {
            if (!draggedItem || draggedItem === item) {
              return;
            }
            if (event.currentTarget.getAnimations().length > 0) {
              return;
            }
            const space = event.currentTarget.getBoundingClientRect();
            const quarter = space.width / 4;
            const crossed = index < currentList.indexOf(draggedItem)
              ? event.clientX < space.right - quarter
              : event.clientX > space.left + quarter;
            if (!crossed) {
              return;
            }
            if (!animated) {
              updateList((oldList) => array.moveToIndex(index, draggedItem, oldList));
              return;
            }
            const overtaken = event.currentTarget;
            const held = overtaken.getBoundingClientRect();
            flushSync(() => updateList((oldList) => array.moveToIndex(index, draggedItem, oldList)));
            const landed = overtaken.getBoundingClientRect();
            if (held.left !== landed.left || held.top !== landed.top) {
              overtaken.animate(
                [{transform: `translate(${held.left - landed.left}px, ${held.top - landed.top}px)`}, {transform: 'none'}],
                {duration: 150, easing: 'ease-out'});
            }
          }}
          label={item}>{item}</Draggable>
      </li>)
  }</ul>
  </>;
};
