import {FC} from 'react';
import {TablesIntroduction} from '../../Tables/Introduction';
import {Aggregations} from '../../Tables';
import {Tutorials} from '../../Tables/Tutorials';

const TablesTab: FC = () => <>
  <TablesIntroduction/>
  <Aggregations/>
  <Tutorials/>
</>;

export default TablesTab;
