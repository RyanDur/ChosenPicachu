import {FC} from 'react';
import {TablesIntroduction} from './Introduction';
import {Aggregations} from './Aggregations';
import {Tutorials} from './Tutorials';

const TablesTab: FC = () => <>
  <TablesIntroduction/>
  <Aggregations/>
  <Tutorials/>
</>;

export default TablesTab;
