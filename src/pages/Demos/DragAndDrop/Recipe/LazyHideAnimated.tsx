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
import gripSource from '../items/Grip.tsx?raw';
import listSource from '../LazyHideAnimatedList/LazyHideAnimatedList.tsx?raw';
import itemSource from '../items/HideItem.tsx?raw';
import cssSource from '../LazyHideAnimatedList/LazyHideAnimatedList.css?raw';

export const LazyHideAnimatedRecipe: FC = () => <>
  <Story param="native" id="sort" steps={8}
         can="The user can arrange the list by hand"
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
  {straightToOrder(gripSource)}
</>;
