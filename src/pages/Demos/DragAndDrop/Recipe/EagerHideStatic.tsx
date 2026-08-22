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
} from './shared-steps';
import gripSource from '../items/Grip.tsx?raw';
import listSource from '../EagerHideStaticList/EagerHideStaticList.tsx?raw';
import itemSource from '../items/HideItem.tsx?raw';
import cssSource from '../EagerHideStaticList/EagerHideStaticList.css?raw';

export const EagerHideStaticRecipe: FC = () => <>
  <Story param="native" id="sort" steps={8}
         can="The user can sort the list"
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
      {fadeOrigin(itemSource, cssSource)}
      {directState(listSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(gripSource)}
</>;
