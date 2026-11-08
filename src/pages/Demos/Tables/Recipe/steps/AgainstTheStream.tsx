import {FC} from 'react';
import {Tell} from '../../../Recipe';
import {whatTheDomIs} from '../definitions';

export const AgainstTheStream: FC = () =>
  <Tell>The trader needs to move a column while the trades keep landing. I could reorder
    the data itself, but every trade that lands would fight every drag. So the columns and
    the seats are the state, in their order; a trade rewrites a row’s values under its key,
    and the markup renders through them. Moving a column is just changing the
    order. {whatTheDomIs} I could ask it where everything is as the pointer moves, but each answer after the
    page has changed makes the browser redo its layout, and a drag that waits on that work stutters. So the lift
    measures everything the drag needs at the grab, as the lift step shows.</Tell>;
