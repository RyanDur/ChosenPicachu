import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  directState,
  fadeOrigin,
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
import listSource from '../LazyHideStaticList/LazyHideStaticList.tsx?raw';
import itemSource from '../items/HideItem.tsx?raw';
import cssSource from '../LazyHideStaticList/LazyHideStaticList.css?raw';

export const LazyHideStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
         can="The user can sort the list"
         soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('lazy', 'hide', 'static')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {innerHalf}
      {stashLanding(listSource)}
      {fadeOrigin(itemSource, cssSource)}
      {directState(listSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(gripSource)}
</>;
