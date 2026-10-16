import {FC} from 'react';
import {Steps, Story} from '../../Recipe';
import {
  AcceptTheDrop,
  ArmTheDrag,
  CommitCrossing,
  DirectState,
  HoldTheAloft,
  InnerHalf,
  KeepStanding,
  PlatformCurrency,
  Promises,
  RoadEnd,
  StraightToOrder
} from './steps';
import gripSource from '../items/Grip.tsx?sample';
import listSource from '../EagerKeepStaticList/EagerKeepStaticList.tsx?sample';
import itemSource from '../items/KeepItem.tsx?sample';

export const EagerKeepStaticRecipe: FC = () => <>
  <Story param="native" id="sort"
    can="The user can arrange the list by hand"
    soThat="it reads in the order they mean">
    <PlatformCurrency/>
    <Promises pace="eager" origin="keep" motion="static"/>
    <Steps>
      <ArmTheDrag itemSource={itemSource}/>
      <HoldTheAloft listSource={listSource}/>
      <AcceptTheDrop listSource={listSource} itemSource={itemSource}/>
      <InnerHalf/>
      <CommitCrossing listSource={listSource}/>
      <KeepStanding listSource={listSource}/>
      <DirectState listSource={listSource}/>
      <RoadEnd/>
    </Steps>
  </Story>
  <StraightToOrder gripSource={gripSource}/>
</>;
