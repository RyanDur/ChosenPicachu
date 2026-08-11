import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {glide} from '@components/glide';
import {Item} from './Item';
import '../sortable-list.css';
import './LazyKeepAnimatedList.css';

type Pushed = Readonly<Record<string, 'left' | 'right'>>;

type Props = {
    list: Set<string>;
};

export const LazyKeepAnimatedList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [landing, setLanding] = useState<Maybe<number>>(nothing());
    const [pushed, setPushed] = useState<Pushed>({});

    const release = () => {
        aloft.and(landing).map(([held, at]) => {
            const settled = array.moveToIndex(at, held, order);
            setTimeout(() => glide(true)(() => setOrder(settled)));
        });
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
                    style={{...(pushed[item] ? {'--toward': pushed[item] === 'left' ? '1' : '-1'} : {}), viewTransitionName: `sort-${item}`}}
                    onAnimationEnd={() => setPushed({})}>
                <Item item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={release}
                    onDragOver={() => setLanding(maybe(index))}
                    onArranged={(after, walker, toward) => {
                        const neighbour = order[order.indexOf(walker) + toward];
                        setPushed({
                            [walker]: toward > 0 ? 'right' : 'left',
                            [neighbour]: toward > 0 ? 'left' : 'right'
                        });
                        setOrder(after);
                    }}/>
            </li>)
    }</ul>;
};
