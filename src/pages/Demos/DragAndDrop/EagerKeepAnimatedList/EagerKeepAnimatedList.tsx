import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components';
import {classNames} from '@components';
import {Moved, session} from '../session';
import {SlideStarts, slideStarts} from '../slide-starts';
import {KeepItem, MoveReport} from '../items';
import '../sortable-list.css';
import './EagerKeepAnimatedList.css';

type Props = {
  list: Set<string>;
};

export const EagerKeepAnimatedList: FC<Props> = ({list}) => {
  const [order, setOrder] = useState<string[]>(() => [...list]);
  const [aloft, setAloft] = useState<Maybe<string>>(nothing());
  const [moved, setMoved] = useState<Maybe<Moved>>(nothing());
  const [slides, setSlides] = useState<SlideStarts>({});

  return <>
    <ol aria-label="sortable list"
      onDragOver={event => event.preventDefault()}
      onDrop={event => event.preventDefault()}
      className="sortable-list card rounded-corners lifted padded contained">{
        order.map((item, index) =>
          <KeepItem key={item}
            className={classNames('item', item in slides && 'sliding-in')}
            style={{'--starts-places-right': slides[item]}}
            onAnimationEnd={() => setSlides({})}
            item={item}
            order={order}
            onLifted={lifted => setAloft(maybe(lifted))}
            onReleased={() => setAloft(nothing())}
            onDragOver={session.crossingOver(aloft, order)(item, index, (held, homeward) => {
              setSlides(slideStarts.afterCrossing(item, homeward));
              setOrder(previous => array.moveToIndex(index, held, previous));
              setMoved(maybe({item: held, position: index, of: order.length}));
            })}
            onArranged={(after, walker, toward) => {
              setSlides(slideStarts.afterKeyboardStep(order, walker, toward));
              setOrder(after);
              setMoved(maybe({item: walker, position: after.indexOf(walker), of: after.length}));
            }}/>)
      }</ol>
    <MoveReport moved={moved}/>
  </>;
};
