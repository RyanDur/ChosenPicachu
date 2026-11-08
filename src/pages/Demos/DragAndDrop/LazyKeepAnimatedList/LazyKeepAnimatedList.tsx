import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {classNames} from '@components';
import {Moved, session} from '../session';
import {SlideStarts, slideStarts} from '../slide-starts';
import {KeepItem, MoveReport} from '../items';
import '../sortable-list.css';
import './LazyKeepAnimatedList.css';

type Props = {
  list: Set<string>;
};

export const LazyKeepAnimatedList: FC<Props> = ({list}) => {
  const [order, setOrder] = useState<string[]>(() => [...list]);
  const [aloft, setAloft] = useState<Maybe<string>>(nothing());
  const [moved, setMoved] = useState<Maybe<Moved>>(nothing());
  const [landing, setLanding] = useState<Maybe<number>>(nothing());
  const [slides, setSlides] = useState<SlideStarts>({});

  const release = () => {
    session.landedOrder(aloft, landing, order).map(session.glided(setOrder));
    session.landedMove(aloft, landing, order).map(landed => setMoved(maybe(landed)));
    setAloft(nothing());
    setLanding(nothing());
  };

  return <>
    <ol aria-label="sortable list"
      onDragOver={event => event.preventDefault()}
      onDrop={event => event.preventDefault()}
      onDragLeave={() => setLanding(nothing())}
      className="sortable-list card rounded-corners lifted padded contained">{
        order.map((item, index) =>
          <KeepItem key={item}
            className={classNames('item', item in slides && 'sliding-in')}
            style={{'--starts-places-right': slides[item], viewTransitionName: `sort-${item}`}}
            onAnimationEnd={() => setSlides({})}
            item={item}
            order={order}
            onLifted={lifted => setAloft(maybe(lifted))}
            onReleased={release}
            onDragOver={() => setLanding(maybe(index))}
            onArranged={(after, walker, toward) => {
              setSlides(slideStarts.afterKeyboardStep(order, walker, toward));
              setOrder(after);
              setMoved(maybe({item: walker, position: after.indexOf(walker), of: after.length}));
            }}/>)
      }</ol>
    <MoveReport moved={moved}/>
  </>;
};
