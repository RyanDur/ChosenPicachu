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
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.tsx?sample';
import itemSource from '../items/KeepItem.tsx?sample';
import cssSource from '../EagerKeepAnimatedList/EagerKeepAnimatedList.css?sample';

export const EagerKeepAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
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
