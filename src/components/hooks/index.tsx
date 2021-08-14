import {useLocation} from 'react-router-dom';
import {URLHelpers} from '../../util/URL';

export const useQuery = <T extends { [key: string]: unknown }>(val?: T): T =>
    URLHelpers.toQueryObj(useLocation().search, val) as T;
