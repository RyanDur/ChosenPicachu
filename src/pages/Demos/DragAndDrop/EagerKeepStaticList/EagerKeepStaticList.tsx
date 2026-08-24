import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Moved, crossingOver} from '../session';
import {KeepItem} from '../items/KeepItem';
import {MoveReport} from '../items/MoveReport';
import '../sortable-list.css';

type Props = {
    list: Set<string>;
};

export const EagerKeepStaticList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [moved, setMoved] = useState<Maybe<Moved>>(nothing());

    return <>
    <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={'item'}>
                <KeepItem item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={() => setAloft(nothing())}
                    onDragOver={crossingOver(aloft, order)(item, index, (held) => {
                        setOrder(previous => array.moveToIndex(index, held, previous));
                        setMoved(maybe({item: held, position: index, of: order.length}));
                    })}
                    onArranged={(after, walker) => {
                        setOrder(after);
                        setMoved(maybe({item: walker, position: after.indexOf(walker), of: after.length}));
                    }}/>
            </li>)
    }</ul>
    <MoveReport moved={moved}/>
    </>;
};
