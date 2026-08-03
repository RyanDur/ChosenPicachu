import {FC, useState} from 'react';
import {array} from '@components/arrays';
import {glide} from '@components/glide';
import {HideOnDrag} from './HideOnDrag';
import {PillGlider} from '@components/PillGlider';
import './styles.css';
import './styles.layout.css';

export const HideElemOnDragSortableListLazyMove: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [motion, updateMotion] = useState<'animated' | 'static'>('static');
  const animated = motion === 'animated';
  const move = glide(animated ?? false);
  const [dragOverIndex, updateIndex] = useState<number>(-1);
  const [draggedItem, updateDraggedItem] = useState<string>();

  return <>
    <PillGlider label="hide-lazy animation style"
                name="hide-lazy-animate-or-static"
                options={[
                  {display: 'Animate', value: 'animated'},
                  {display: 'Static', value: 'static'}
                ]}
                chosen={motion}
                onChoose={updateMotion}/>
    <ul onDragLeave={() => updateIndex(-1)}
             onDragOver={event => event.preventDefault()}
             onDrop={event => event.preventDefault()}
             className='hide-elem-on-drag-sortable-list-lazy-move sortable-list'>{
    currentList.map((item, index) =>
      <li className='item' key={item}
          style={animated ? {viewTransitionName: `hide-lazy-${item}`} : undefined}>
        <HideOnDrag
          onDragEnd={() => {
            if (draggedItem && dragOverIndex >= 0) {
              const settled = array.moveToIndex(dragOverIndex, draggedItem, currentList);
              setTimeout(() => move(() => updateList(settled)));
            }
            updateDraggedItem(undefined);
          }}
          onDragStart={() => updateDraggedItem(item)}
          onDragOver={() => updateIndex(index)}
          label={item}
        >{item}</HideOnDrag>
      </li>
    )}</ul>
  </>;
};
