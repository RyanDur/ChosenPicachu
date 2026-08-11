import {FC, useState} from 'react';
import {has, Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {crossed} from '../crossing';
import {Item} from './Item';
import '../sortable-list.css';
import './EagerHideAnimatedList.css';

type Pushed = Readonly<Record<string, 'left' | 'right'>>;

type Props = {
    list: Set<string>;
};

export const EagerHideAnimatedList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [pushed, setPushed] = useState<Pushed>({});

    return <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={classNames('item', pushed[item] && 'pushed')}
                    style={pushed[item] ? {'--toward': pushed[item] === 'left' ? '1' : '-1'} : undefined}
                    onAnimationEnd={() => setPushed({})}>
                <Item item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={() => setAloft(nothing())}
                    onDragOver={event => {
                        const lane = event.currentTarget.closest('li');
                        if (has(lane) && lane.getAnimations().length > 0) {
                            return;
                        }
                        aloft.map(held => {
                            if (held === item) {
                                return;
                            }
                            const homeward = index < order.indexOf(held);
                            if (crossed(event, homeward)) {
                                setPushed({[item]: homeward ? 'right' : 'left'});
                                setOrder(previous => array.moveToIndex(index, held, previous));
                            }
                        });
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
