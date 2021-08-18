import {Dispatch} from './types';
import {error, HTTPAction, loading, success} from './actions';
import {toUrl} from '../util/URL';

interface URI {
    path: string;
    queryParams?: Record<string, unknown>
}

export const http = <T>({path, queryParams}: URI, dispatch: Dispatch<HTTPAction<T>>) => {
    dispatch(loading());
    fetch(toUrl(path, queryParams)).then(async response => {
        if (response.status === 200) dispatch(success(await response.json()));
        else dispatch(error());
    });
};