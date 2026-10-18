import {useSearchParamsObject} from '@components/search-params';
import {Concern} from '@pages/Record/moments/concerns';
import {concernParam} from './types';

export const useConcernShown = (): Concern => useSearchParamsObject({tab: concernParam}, {tab: 'Structure'}).tab;
