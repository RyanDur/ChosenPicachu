import {FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {glide} from '@components/glide';
import {Item} from './Item';
import '../sortable-list.css';
import './LazyHideAnimatedList.css';

type Pushed = Readonly<Record<string, 'left' | 'right'>>;

type Props = {
    list: Set<string>;
};

export const LazyHideAnimatedList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<string>();
    const [landing, setLanding] = useState(-1);
    const [pushed, setPushed] = useState<Pushed>();

    return <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               onDragLeave={() => setLanding(-1)}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={classNames('item', has(pushed?.[item]) && 'pushed')}
                    style={{...(has(pushed?.[item]) ? {'--toward': pushed?.[item] === 'left' ? '1' : '-1'} : {}), viewTransitionName: `sort-${item}`}}
                    onAnimationEnd={() => setPushed(undefined)}>
                <Item item={item}
                    order={order}
                    onLifted={setAloft}
                    onReleased={() => {
                        if (has(aloft) && landing >= 0) {
                            const settled = array.moveToIndex(landing, aloft, order);
                            setTimeout(() => glide(true)(() => setOrder(settled)));
                        }
                        setAloft(undefined);
                        setLanding(-1);
                    }}
                    onDragOver={() => setLanding(index)}
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
