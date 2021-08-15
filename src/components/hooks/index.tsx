import {useLocation} from 'react-router-dom';
import {toQueryObj} from '../../util/URL';

export const useQuery = <T extends { [key: string]: unknown }>(val?: T): T =>
    toQueryObj(useLocation().search, val) as T;
