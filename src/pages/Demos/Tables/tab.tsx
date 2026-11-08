import {FC} from 'react';
import {TablesIntroduction} from './Introduction';
import {Aggregations} from './Aggregations';
import {Tutorials} from './Tutorials';
import {TutorialPage} from './TutorialPage';
import {useShownTutorial} from './useShownTutorial';

const TabContents: FC = () => <>
  <TablesIntroduction/>
  <Aggregations/>
  <Tutorials/>
</>;

export const Room: FC = () => useShownTutorial().either(
  () => <TutorialPage/>,
  () => <TabContents/>);
