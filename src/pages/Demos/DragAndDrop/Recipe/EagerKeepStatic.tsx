import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  commitCrossing,
  directState,
  holdTheAloft,
  innerHalf,
  keepStanding,
  neverOurs,
  platformCurrency,
  promises,
  roadEnd,
  straightToOrder
} from './shared-steps';
import gripSource from '../items/Grip.tsx?raw';
import listSource from '../EagerKeepStaticList/EagerKeepStaticList.tsx?raw';
import itemSource from '../items/KeepItem.tsx?raw';

export const EagerKeepStaticRecipe: FC = () => <>
  <Story param="native" id="sort" steps={8}
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('eager', 'keep', 'static')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      {commitCrossing(listSource)}
      {keepStanding(listSource)}
      {directState(listSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(gripSource)}
</>;
