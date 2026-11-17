import {FC} from 'react';
import {TablesIntroduction} from './Introduction';
import {Aggregations} from './Aggregations';
import {Tutorials} from './Tutorials';
import {TutorialPage} from './TutorialPage';
import {useShownTutorial} from './useShownTutorial';
import {ToTutorialNamed} from './ToTutorialNamed';
import {PartPage} from './PartPage';
import {useShownPart} from './useShownPart';

const TabContents: FC = () => <>
  <ToTutorialNamed/>
  <TablesIntroduction/>
  <Aggregations/>
  <Tutorials/>
</>;

export const Room: FC = () => {
  const part = useShownPart();
  return useShownTutorial().either(
    () => <TutorialPage/>,
    () => part.either(shown => <PartPage part={shown}/>, () => <TabContents/>));
};
