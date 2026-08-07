import {FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {array} from '@components/arrays';
import {crossed} from '../crossing';
import {Item} from './Item';
import '../sortable-list.css';
import './EagerHideStaticList.css';

type Props = {
    list: Set<string>;
};

export const EagerHideStaticList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<string>();

    return <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={'item'}>
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
                                setOrder(previous => array.moveToIndex(index, aloft, previous));
                            }
                        }
                    }}
                    onArranged={setOrder}/>
            </li>)
    }</ul>;
};
