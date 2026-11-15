import {AllClosed, Closed, Opened} from './fold-change';

type OpenFolds = readonly string[];

export const openFolds = {
  together: (open: OpenFolds, change: Opened | Closed): OpenFolds =>
    change.type === 'opened' ? [...open, change.bar] : open.filter(bar => bar !== change.bar),
  oneAtATime: (_open: OpenFolds, change: Opened | AllClosed): OpenFolds =>
    change.type === 'opened' ? [change.bar] : []
};
