import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {glided, landedOrder} from '../session';
import {Pushed, pushedStyle, walkedMarks} from '../marks';
import {KeepItem} from '../items/KeepItem';
import '../sortable-list.css';
import './LazyKeepAnimatedList.css';

type Props = {
    list: Set<string>;
};

export const LazyKeepAnimatedList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [landing, setLanding] = useState<Maybe<number>>(nothing());
    const [pushed, setPushed] = useState<Pushed>({});

    const release = () => {
        landedOrder(aloft, landing, order).map(glided(setOrder));
        setAloft(nothing());
        setLanding(nothing());
    };

    return <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               onDragLeave={() => setLanding(nothing())}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={classNames('item', pushed[item] && 'pushed')}
                    style={{...pushedStyle(pushed[item]), viewTransitionName: `sort-${item}`}}
                    onAnimationEnd={() => setPushed({})}>
                <KeepItem item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={release}
                    onDragOver={() => setLanding(maybe(index))}
                    onArranged={(after, walker, toward) => {
                        setPushed(walkedMarks(order, walker, toward));
                        setOrder(after);
                    }}/>
            </li>)
    }</ul>;
};
