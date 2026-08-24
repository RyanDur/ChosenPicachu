import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {Moved, landedMove, landedOrder} from '../session';
import {KeepItem} from '../items/KeepItem';
import {MoveReport} from '../items/MoveReport';
import '../sortable-list.css';

type Props = {
    list: Set<string>;
};

export const LazyKeepStaticList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [moved, setMoved] = useState<Maybe<Moved>>(nothing());
    const [landing, setLanding] = useState<Maybe<number>>(nothing());

    const release = () => {
        landedOrder(aloft, landing, order).map(setOrder);
        landedMove(aloft, landing, order).map(landed => setMoved(maybe(landed)));
        setAloft(nothing());
        setLanding(nothing());
    };

    return <>
    <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               onDragLeave={() => setLanding(nothing())}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={'item'}>
                <KeepItem item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={release}
                    onDragOver={() => setLanding(maybe(index))}
                    onArranged={(after, walker) => {
                        setOrder(after);
                        setMoved(maybe({item: walker, position: after.indexOf(walker), of: after.length}));
                    }}/>
            </li>)
    }</ul>
    <MoveReport moved={moved}/>
    </>;
};
