import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components/arrays';
import {classNames} from '@components/class-names';
import {Moved, crossingOver} from '../session';
import {Pushed, crossedMark, pushedStyle, walkedMarks} from '../marks';
import {HideItem} from '../items/HideItem';
import {MoveReport} from '../items/MoveReport';
import '../sortable-list.css';
import './EagerHideAnimatedList.css';

type Props = {
    list: Set<string>;
};

export const EagerHideAnimatedList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [moved, setMoved] = useState<Maybe<Moved>>(nothing());
    const [pushed, setPushed] = useState<Pushed>({});

    return <>
    <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={classNames('item', pushed[item] && 'pushed')}
                    style={pushedStyle(pushed[item])}
                    onAnimationEnd={() => setPushed({})}>
                <HideItem item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={() => setAloft(nothing())}
                    onDragOver={crossingOver(aloft, order)(item, index, (held, homeward) => {
                        setPushed(crossedMark(item, homeward));
                        setOrder(previous => array.moveToIndex(index, held, previous));
                        setMoved(maybe({item: held, position: index, of: order.length}));
                    })}
                    onArranged={(after, walker, toward) => {
                        setPushed(walkedMarks(order, walker, toward));
                        setOrder(after);
                        setMoved(maybe({item: walker, position: after.indexOf(walker), of: after.length}));
                    }}/>
            </li>)
    }</ul>
    <MoveReport moved={moved}/>
    </>;
};
