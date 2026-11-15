import {AllClosed, Closed, Opened} from './fold-change';

type OpenFolds = readonly string[];

export const openFolds = {
  together: (open: OpenFolds, change: Opened | Closed): OpenFolds =>
    change.type === 'opened' ? [...open, change.fold] : open.filter(fold => fold !== change.fold),
  oneAtATime: (_open: OpenFolds, change: Opened | AllClosed): OpenFolds =>
    change.type === 'opened' ? [change.fold] : []
};
