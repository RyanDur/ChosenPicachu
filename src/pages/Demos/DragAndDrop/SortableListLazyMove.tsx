import {FC, useState} from 'react';
import {array} from '@components/arrays';
import {glide} from '@components/glide';
import {Draggable} from './Draggable';
import {PillGlider} from '@components/PillGlider';
import './styles.css';
import './styles.layout.css';

export const SortableListLazyMove: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [motion, updateMotion] = useState<'animated' | 'static'>('static');
  const animated = motion === 'animated';
  const move = glide(animated ?? false);
  const [dragOverIndex, updateIndex] = useState<number>(-1);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <>
    <PillGlider label="lazy animation style"
                name="lazy-animate-or-static"
                options={[
                  {display: 'Animate', value: 'animated'},
                  {display: 'Static', value: 'static'}
                ]}
                chosen={motion}
                onChoose={updateMotion}/>
    <ul onDragLeave={() => updateIndex(-1)}
             onDragOver={event => event.preventDefault()}
             onDrop={event => event.preventDefault()}
             className='sortable-list-lazy-move sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}
          style={animated ? {viewTransitionName: `lazy-${item}`} : undefined}>
        <Draggable
          onDragEnd={() => {
            if (draggedItem && dragOverIndex >= 0) {
              const settled = array.moveToIndex(dragOverIndex, draggedItem, currentList);
              setTimeout(() => move(() => updateList(settled)));
            }
            updateDraggedItem(undefined);
          }}
          onDragStart={() => updateDraggedItem(item)}
          onDragOver={() => updateIndex(index)}
          label={item}>{item}</Draggable>
      </li>)
  }</ul>
  </>;
};
