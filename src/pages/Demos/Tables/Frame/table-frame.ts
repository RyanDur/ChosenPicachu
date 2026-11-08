import {TableFrameChange} from './table-frame-change';

export type TableFrameState = {
  readonly frameMarkup?: string;
  readonly frame?: HTMLIFrameElement;
  readonly height?: number;
};

const initial: TableFrameState = {};

const reduce = (state: TableFrameState, change: TableFrameChange): TableFrameState => {
  switch (change.type) {
    case 'assembled': return {...state, frameMarkup: change.frameMarkup};
    case 'loaded': return {...state, frame: change.frame};
    case 'grown': return {...state, height: change.height};
  }
};

type TableFrameModule = {
  initial: TableFrameState;
  reduce: (state: TableFrameState, change: TableFrameChange) => TableFrameState;
};

export const tableFrame: TableFrameModule = {initial, reduce};
