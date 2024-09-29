import {useNavigate, useLocation} from 'react-router-dom';
import {toQueryObj, toQueryString} from '../../util/URL';
import {Consumer} from '@ryandur/sand';
import {useEffect} from "react";

type Query<T extends { [key: string]: unknown }> = {
    queryObj: T,
    path: string,
    updateQueryString: Consumer<Partial<T>>,
    nextQueryString: (params: Partial<T>) => string
};
export const useQuery = <T extends { [key: string]: unknown }>(val?: T): Query<T> => {
    const navigate = useNavigate();
    const location = useLocation();
    const nextQueryString = (params: Partial<T>): string => {
        const currentParams = toQueryObj(location.search, val);
        return toQueryString({...currentParams, ...params});
    };

    const updateQueryString = (params: Partial<T>) => {
        navigate({search: nextQueryString(params)});
    };

    useEffect(() => {
        if(val) updateQueryString(val);
    }, []);

    return {
        queryObj: toQueryObj(location.search, val) as T,
        path: location.pathname,
        updateQueryString,
        nextQueryString
    };
};
