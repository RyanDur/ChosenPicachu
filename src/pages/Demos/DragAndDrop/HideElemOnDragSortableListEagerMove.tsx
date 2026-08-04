import {FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {HideOnDrag} from './HideOnDrag';
import {PillGlider} from '@components/PillGlider';
import './styles.css';
import './styles.layout.css';

export const HideElemOnDragSortableListEagerMove: FC<{ list: Set<string> }> = ({list}) => {
  const [currentList, updateList] = useState<string[]>([...list]);
  const [motion, updateMotion] = useState<'animated' | 'static'>('static');
  const animated = motion === 'animated';
  const [draggedItem, updateDraggedItem] = useState<string>();
  const [pushed, setPushed] = useState<{item: string; toward: 'left' | 'right'}>();

  return <>
    <PillGlider label="hide-eager animation style"
                name="hide-eager-animate-or-static"
                options={[
                  {display: 'Animate', value: 'animated'},
                  {display: 'Static', value: 'static'}
                ]}
                chosen={motion}
                onChoose={updateMotion}/>
    <ul
    onDragOver={event => event.preventDefault()}
    onDrop={event => event.preventDefault()}
    className='hide-elem-on-drag-sortable-list-eager-move sortable-list'>{
    currentList.map((item, index) =>
      <li className={classNames('item', has(pushed) && pushed.item === item && `pushed-${pushed.toward}`)}
          key={item}
          onAnimationEnd={() => setPushed(undefined)}>
        <HideOnDrag
          onDragStart={() => updateDraggedItem(item)}
          onDragEnd={() => updateDraggedItem(undefined)}
          onDragOver={event => {
            if (!draggedItem || draggedItem === item) {
              return;
            }
            const lane = event.currentTarget.closest('li');
            if (has(lane) && lane.getAnimations().length > 0) {
              return;
            }
            const space = event.currentTarget.getBoundingClientRect();
            const quarter = space.width / 4;
            const homeward = index < currentList.indexOf(draggedItem);
            const crossed = homeward
              ? event.clientX < space.right - quarter
              : event.clientX > space.left + quarter;
            if (!crossed) {
              return;
            }
            if (animated) {
              setPushed({item, toward: homeward ? 'right' : 'left'});
            }
            updateList((oldList) => array.moveToIndex(index, draggedItem, oldList));
          }}
          label={item}
        >{item}</HideOnDrag>
      </li>
    )}</ul>
  </>;
};

