import {FC} from 'react';
import {DialNote} from '../../Recipe';
import {TableControls} from '../TableControls';
import {Recipe} from '../Recipe';

export const DragSortTutorial: FC = () => <>
  <DialNote reads="table"/>
  <TableControls/>
  <Recipe/>
</>;
