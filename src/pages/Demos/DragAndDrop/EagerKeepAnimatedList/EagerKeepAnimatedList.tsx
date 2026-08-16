import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {crossingOver} from '../session';
import {Pushed, crossedMark, pushedStyle, walkedMarks} from '../marks';
import {KeepItem} from '../items/KeepItem';
import '../sortable-list.css';
import './EagerKeepAnimatedList.css';

type Props = {
    list: Set<string>;
};

export const EagerKeepAnimatedList: FC<Props> = ({list}) => {
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
                    style={pushedStyle(pushed[item])}
                    onAnimationEnd={() => setPushed({})}>
                <KeepItem item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={() => setAloft(nothing())}
                    onDragOver={crossingOver(aloft, order)(item, index, (held, homeward) => {
                        setPushed(crossedMark(item, homeward));
                        setOrder(previous => array.moveToIndex(index, held, previous));
                    })}
                    onArranged={(after, walker, toward) => {
                        setPushed(walkedMarks(order, walker, toward));
                        setOrder(after);
                    }}/>
            </li>)
    }</ul>;
};
