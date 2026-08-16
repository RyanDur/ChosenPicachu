import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  glideSettle,
  holdTheAloft,
  innerHalf,
  keepStanding,
  neverOurs,
  platformCurrency,
  promises,
  roadEnd,
  stashLanding,
  straightToOrder
} from './shared-steps';
import gripSource from '../items/Grip.tsx?raw';
import listSource from '../LazyKeepAnimatedList/LazyKeepAnimatedList.tsx?raw';
import itemSource from '../items/KeepItem.tsx?raw';

export const LazyKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('lazy', 'keep', 'animated')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      {stashLanding(listSource)}
      {keepStanding(listSource)}
      {glideSettle(listSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(gripSource)}
</>;
