import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  commitCrossing,
  holdTheAloft,
  innerHalf,
  keepStanding,
  neverOurs,
  platformCurrency,
  promises,
  roadEnd,
  slideCrossed,
  straightToOrder
} from './shared-steps';
import gripSource from '../items/Grip.tsx?raw';
import listSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.tsx?raw';
import itemSource from '../items/KeepItem.tsx?raw';
import cssSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.css?raw';

export const EagerKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort" steps={8}
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('eager', 'keep', 'animated')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      {commitCrossing(listSource)}
      {keepStanding(listSource)}
      {slideCrossed(listSource, cssSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(gripSource)}
</>;
