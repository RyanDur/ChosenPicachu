import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {DialNote} from '../../Recipe';
import {tablesDials} from '../params';
import {TableControls} from '../TableControls';
import {Recipe} from '../Recipe';

const tableDials = tablesDials();

export const DragSortTutorial: FC = () => {
  const {world} = useSearchParamsObject({world: tableDials.world}, tableDials.defaults);
  return <>
    <DialNote reads="table"/>
    <TableControls world={world}/>
    <Recipe/>
  </>;
};
