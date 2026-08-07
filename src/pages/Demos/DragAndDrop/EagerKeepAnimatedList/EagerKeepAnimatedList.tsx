import {FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {crossed} from '../crossing';
import {Item} from './Item';
import '../sortable-list.css';
import './EagerKeepAnimatedList.css';

type Pushed = Readonly<Record<string, 'left' | 'right'>>;

type Props = {
    list: Set<string>;
};

export const EagerKeepAnimatedList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<string>();
    const [pushed, setPushed] = useState<Pushed>();

    return <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={classNames('item', has(pushed?.[item]) && 'pushed')}
                    style={has(pushed?.[item]) ? {'--toward': pushed?.[item] === 'left' ? '1' : '-1'} : undefined}
                    onAnimationEnd={() => setPushed(undefined)}>
                <Item item={item}
                    order={order}
                    onLifted={setAloft}
                    onReleased={() => setAloft(undefined)}
                    onDragOver={event => {
                        const lane = event.currentTarget.closest('li');
                        if (has(lane) && (lane.getAnimations?.().length ?? 0) > 0) {
                            return;
                        }
                        if (has(aloft) && aloft !== item) {
                            const homeward = index < order.indexOf(aloft);
                            if (crossed(event, homeward)) {
                                setPushed({[item]: homeward ? 'right' : 'left'});
                                setOrder(previous => array.moveToIndex(index, aloft, previous));
                            }
                        }
                    }}
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
