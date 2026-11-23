import {FC} from 'react';
import {PartsBeside} from '../PartsBeside';
import {TablesIntroduction} from './Introduction';
import {WorldDial} from './WorldDial';
import {Aggregations} from './Aggregations';
import {Tutorials} from './Tutorials';
import {TutorialPage} from './TutorialPage';
import {useShownTutorial} from './useShownTutorial';
import {ToMovedAddress} from './ToMovedAddress';
import {PartPage} from './PartPage';
import {useShownPart} from './useShownPart';

const TabContents: FC = () => <>
  <ToMovedAddress/>
  <PartsBeside>
    <TablesIntroduction/>
    <WorldDial/>
    <Aggregations/>
    <Tutorials/>
  </PartsBeside>
</>;

export const Room: FC = () => {
  const part = useShownPart();
  return useShownTutorial().either(
    () => <TutorialPage/>,
    () => part.either(shown => <PartPage part={shown}/>, () => <TabContents/>));
};
