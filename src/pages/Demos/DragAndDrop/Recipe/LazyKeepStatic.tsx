import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  DirectState,
  HoldTheAloft,
  KeepStanding,
  PlatformCurrency,
  Promises,
  RoadEnd,
  StashLanding,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../LazyKeepStaticList.tsx?sample';
import itemSource from '../items/KeepItem.tsx?sample';

export const LazyKeepStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <StashLanding listSource={listSource}/>
      <KeepStanding listSource={listSource}/>
      <DirectState listSource={listSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
