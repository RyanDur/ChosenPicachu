import {FC, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Item} from './Item';
import '../sortable-list.css';
import './LazyHideStaticList.css';

type Props = {
    list: Set<string>;
};

export const LazyHideStaticList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());
    const [landing, setLanding] = useState<Maybe<number>>(nothing());

    const release = () => {
        aloft.and(landing).map(([held, at]) => setOrder(array.moveToIndex(at, held, order)));
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
                className={'item'}>
                <Item item={item}
                    order={order}
                    onLifted={lifted => setAloft(maybe(lifted))}
                    onReleased={release}
                    onDragOver={() => setLanding(maybe(index))}
                    onArranged={setOrder}/>
            </li>)
    }</ul>;
};
