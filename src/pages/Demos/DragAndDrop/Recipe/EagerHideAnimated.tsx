import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  commitCrossing,
  fadeOrigin,
  holdTheAloft,
  innerHalf,
  neverOurs,
  platformCurrency,
  promises,
  roadEnd,
  slideCrossed,
  straightToOrder
} from './shared-steps';
import listSource from '../EagerHideAnimatedList/EagerHideAnimatedList.tsx?raw';
import itemSource from '../EagerHideAnimatedList/Item.tsx?raw';
import cssSource from '../EagerHideAnimatedList/EagerHideAnimatedList.css?raw';

export const EagerHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('eager', 'hide', 'animated')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      {commitCrossing(listSource)}
      {fadeOrigin(itemSource, cssSource)}
      {slideCrossed(listSource, cssSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(itemSource)}
</>;
