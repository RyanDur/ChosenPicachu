import {useHistory, useLocation} from 'react-router-dom';
import {toQueryObj, toQueryString} from '../../util/URL';
import {Consumer} from '../UserInfo/types';

type Query<T extends { [key: string]: unknown }> = {
    queryObj: T,
    path: string,
    updateQueryString: Consumer<T>,
    nextQueryString: (params: Partial<T>) => string
};
export const useURL = <T extends { [key: string]: unknown }>(val?: T): Query<T> => {
    const history = useHistory();
    const location = useLocation();
    const nextQueryString = (params: Partial<T>): string => {
        const currentParams = toQueryObj(location.search, val);
        return toQueryString({...currentParams, ...params});
    };

    const updateQueryString = (params: T) => {
        history.push({search: nextQueryString(params)});
    };

    return {
        queryObj: toQueryObj(location.search, val) as T,
        path: location.pathname,
        updateQueryString,
        nextQueryString
    };
};
