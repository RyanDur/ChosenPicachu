import {FC} from 'react';
import {TabSidecar} from '../TabSidecar';
import {TablesIntroduction} from './Introduction';
import {TablesSize} from './TablesSize';
import {PartsIndex} from './PartsIndex';
import {WorldGlider, WorldNote} from './World';
import {Aggregations} from './Aggregations';
import {Tutorials} from './Tutorials';
import {TutorialPage} from './TutorialPage';
import {useShownTutorial} from './useShownTutorial';
import {ToMovedAddress} from './ToMovedAddress';
import {PartPage} from './PartPage';
import {useShownPart} from './useShownPart';

const TabContents: FC = () => <>
  <ToMovedAddress/>
  <TablesIntroduction/>
  <TabSidecar label="parts and dials">
    <TablesSize/>
    <PartsIndex/>
    <WorldGlider/>
    <WorldNote/>
  </TabSidecar>
  <Aggregations/>
  <Tutorials/>
</>;

export const Room: FC = () => {
  const part = useShownPart();
  return useShownTutorial().either(
    () => <TutorialPage/>,
    () => part.either(shown => <PartPage part={shown}/>, () => <TabContents/>));
};
