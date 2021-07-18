import {useLocation} from 'react-router-dom';

export const useQuery = <T extends Object>(val?: T): T => useLocation().search
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((acc, [key, value]) => ({...acc, [key]: value}), val as T);
