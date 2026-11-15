import {FC} from 'react';
import {TablesIntroduction} from './Introduction';
import {Aggregations} from './Aggregations';
import {Tutorials} from './Tutorials';
import {TutorialPage} from './TutorialPage';
import {useShownTutorial} from './useShownTutorial';
import {ToTutorialNamed} from './ToTutorialNamed';

const TabContents: FC = () => <>
  <ToTutorialNamed/>
  <TablesIntroduction/>
  <Aggregations/>
  <Tutorials/>
</>;

export const Room: FC = () => useShownTutorial().either(
  () => <TutorialPage/>,
  () => <TabContents/>);
