import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  commitCrossing,
  directState,
  fadeOrigin,
  holdTheAloft,
  innerHalf,
  neverOurs,
  platformCurrency,
  promises,
  roadEnd,
  straightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../EagerHideStaticList/EagerHideStaticList.tsx?sample';
import itemSource from '../items/HideItem.tsx?sample';

export const EagerHideStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('eager', 'hide', 'static')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      {commitCrossing(listSource)}
      {fadeOrigin(itemSource)}
      {directState(listSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(gripSource)}
</>;
