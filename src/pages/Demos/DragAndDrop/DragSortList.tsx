import {DragEvent, FC, useState} from 'react';
import {has, not} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {glide} from '@components/glide';
import {DragStyle} from '@components/DragSortableTable';
import {Draggable} from './Draggable';
import {HideOnDrag} from './HideOnDrag';
import './styles.css';
import './styles.layout.css';

type Props = {
  list: Set<string>;
  dragStyle: DragStyle;
  animated?: boolean;
};

export const DragSortList: FC<Props> = ({list, dragStyle, animated = false}) => {
  const [order, setOrder] = useState<string[]>(() => [...list]);
  const [aloft, setAloft] = useState<string>();
  const [landing, setLanding] = useState<number>(-1);
  const [pushed, setPushed] = useState<{item: string; toward: 'left' | 'right'}>();
  const eager = dragStyle === 'eager-move' || dragStyle === 'hide-eager-move';
  const hiding = dragStyle === 'hide-eager-move' || dragStyle === 'hide-lazy-move';
  const Item = hiding ? HideOnDrag : Draggable;
  const settle = glide(animated && not(eager));

  const crossing = (event: DragEvent<HTMLElement>, item: string, index: number, carried: string): void => {
    const lane = event.currentTarget.closest('li');
    if (has(lane) && (lane.getAnimations?.().length ?? 0) > 0) {
      return;
    }
    const space = event.currentTarget.getBoundingClientRect();
    const quarter = space.width / 4;
    const homeward = index < order.indexOf(carried);
    const crossed = homeward
      ? event.clientX < space.right - quarter
      : event.clientX > space.left + quarter;
    if (not(crossed)) {
      return;
    }
    if (animated) {
      setPushed({item, toward: homeward ? 'right' : 'left'});
    }
    setOrder(previous => array.moveToIndex(index, carried, previous));
  };

  return <ul aria-label="sortable list"
             onDragLeave={() => setLanding(-1)}
             onDragOver={event => event.preventDefault()}
             onDrop={event => event.preventDefault()}
             className="sortable-list">{
    order.map((item, index) =>
      <li className={classNames('item', has(pushed) && pushed.item === item && `pushed-${pushed.toward}`)}
          key={item}
          style={animated && not(eager) ? {viewTransitionName: `sort-${item}`} : undefined}
          onAnimationEnd={() => setPushed(undefined)}>
        <Item
          onDragStart={() => setAloft(item)}
          onDragEnd={() => {
            if (not(eager) && has(aloft) && landing >= 0) {
              const settled = array.moveToIndex(landing, aloft, order);
              setTimeout(() => settle(() => setOrder(settled)));
            }
            setAloft(undefined);
            setLanding(-1);
          }}
          onDragOver={event => {
            if (not(eager)) {
              setLanding(index);
            } else if (has(aloft) && aloft !== item) {
              crossing(event, item, index, aloft);
            }
          }}
          label={item}>{item}</Item>
      </li>)
  }</ul>;
};
