import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  acceptTheDrop,
  armTheDrag,
  directState,
  fadeOrigin,
  holdTheAloft,
  neverOurs,
  platformCurrency,
  promises,
  roadEnd,
  stashLanding,
  straightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../LazyHideStaticList/LazyHideStaticList.tsx?sample';
import itemSource from '../items/HideItem.tsx?sample';

export const LazyHideStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    {platformCurrency}
    {promises('lazy', 'hide', 'static')}
    {neverOurs}
    <Steps>
      {armTheDrag(itemSource)}
      {holdTheAloft(listSource)}
      {acceptTheDrop(listSource)}
      {stashLanding(listSource)}
      {fadeOrigin(itemSource)}
      {directState(listSource)}
      {roadEnd}
    </Steps>
  </Story>
  {straightToOrder(gripSource)}
</>;
