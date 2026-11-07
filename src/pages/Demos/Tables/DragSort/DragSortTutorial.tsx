import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {DialNote} from '../../Recipe';
import {tablesDials} from '../params';
import {TableControls} from '../TableControls';
import {Recipe} from '../Recipe';

export const DragSortTutorial: FC = () => {
  const {world} = useSearchParamsObject({world: tablesDials.world}, tablesDials.defaults);
  return <>
    <DialNote reads="table"/>
    <TableControls world={world}/>
    <Recipe/>
  </>;
};
