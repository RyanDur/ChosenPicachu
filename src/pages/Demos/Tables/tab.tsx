import {FC} from 'react';
import {PageWithParts} from '../PageWithParts';
import {TablesIntroduction} from './Introduction';
import {WorldDial} from './WorldDial';
import {KeptCurrentTable} from './KeptCurrentTable';
import {Tutorials} from './Tutorials';
import {TutorialPage} from './TutorialPage';
import {useShownTutorial} from './useShownTutorial';
import {ToMovedAddress} from './ToMovedAddress';
import {PartPage} from './PartPage';
import {useShownPart} from './useShownPart';

const TabContents: FC = () => <>
  <ToMovedAddress/>
  <PageWithParts>
    <TablesIntroduction/>
    <WorldDial/>
    <KeptCurrentTable/>
    <Tutorials/>
  </PageWithParts>
</>;

export const Room: FC = () => {
  const part = useShownPart();
  return useShownTutorial().either(
    () => <TutorialPage/>,
    () => part.either(shown => <PartPage part={shown}/>, () => <TabContents/>));
};
