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

const TablesTab: FC = () => useShownTutorial().either(
  () => <TutorialPage/>,
  () => <TabContents/>);

export default TablesTab;
