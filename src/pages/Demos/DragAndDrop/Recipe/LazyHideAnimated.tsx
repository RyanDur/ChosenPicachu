import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  fadeOrigin,
  glideSettle,
  holdTheAloft,
  innerHalf,
  neverOurs,
  platformCurrency,
  promises,
  roadEnd,
  stashLanding,
  straightToOrder
} from './shared-steps';
import listSource from '../LazyHideAnimatedList/LazyHideAnimatedList.tsx?raw';
import itemSource from '../LazyHideAnimatedList/Item.tsx?raw';
import cssSource from '../LazyHideAnimatedList/LazyHideAnimatedList.css?raw';

export const LazyHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('lazy', 'hide', 'animated')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      {stashLanding(listSource)}
      {fadeOrigin(itemSource, cssSource)}
      {glideSettle(listSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(itemSource)}
</>;
