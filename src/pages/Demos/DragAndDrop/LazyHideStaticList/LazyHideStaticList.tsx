import {FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {Item} from './Item';
import '../sortable-list.css';
import './LazyHideStaticList.css';

type Props = {
    list: Set<string>;
};

export const LazyHideStaticList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<string>();
    const [landing, setLanding] = useState(-1);

    return <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               onDragLeave={() => setLanding(-1)}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={'item'}>
                <Item item={item}
                    order={order}
                    onLifted={setAloft}
                    onReleased={() => {
                        if (has(aloft) && landing >= 0) {
                            const settled = array.moveToIndex(landing, aloft, order);
                            setOrder(settled);
                        }
                        setAloft(undefined);
                        setLanding(-1);
                    }}
                    onDragOver={() => setLanding(index)}
                    onArranged={setOrder}/>
            </li>)
    }</ul>;
};
