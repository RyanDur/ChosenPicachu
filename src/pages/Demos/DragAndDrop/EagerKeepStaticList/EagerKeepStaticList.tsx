import {FC, useState} from 'react';
import {has, Maybe, maybe, nothing} from '@ryandur/sand';
import {array} from '@components/arrays';
import {crossed} from '../crossing';
import {Item} from './Item';
import '../sortable-list.css';

type Props = {
    list: Set<string>;
};

export const EagerKeepStaticList: FC<Props> = ({list}) => {
    const [order, setOrder] = useState<string[]>(() => [...list]);
    const [aloft, setAloft] = useState<Maybe<string>>(nothing());

    return <ul aria-label="sortable list"
               onDragOver={event => event.preventDefault()}
               onDrop={event => event.preventDefault()}
               className="sortable-list">{
        order.map((item, index) =>
            <li key={item}
                className={'item'}>
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
                                setOrder(previous => array.moveToIndex(index, held, previous));
                            }
                        });
                    }}
                    onArranged={setOrder}/>
            </li>)
    }</ul>;
};
