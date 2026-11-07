import {useSearchParamsObject} from '@components/search-params';
import {tablesDials} from '../params';

const tableDials = tablesDials();

export const useWorld = () => useSearchParamsObject({world: tableDials.world}, tableDials.defaults);
