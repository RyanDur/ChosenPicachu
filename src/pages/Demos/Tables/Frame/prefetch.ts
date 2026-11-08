import {asyncResult} from '@ryandur/sand';

type Prefetch = {
  assembly: () => void;
};

export const prefetch: Prefetch = {
  assembly: () => {
    asyncResult(import('./assemble'));
  }
};
