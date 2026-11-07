import {useSearchParamsObject} from '@components/search-params';
import {tablesDials} from '../params';

export const useWorld = () => useSearchParamsObject({world: tablesDials.world}, tablesDials.defaults);
