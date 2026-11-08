import {PlainFoldChange} from './plain-fold-change';

export type PlainFoldState = {
  readonly document?: string;
  readonly body?: HTMLElement;
  readonly height?: number;
};

const initial: PlainFoldState = {};

const reduce = (state: PlainFoldState, change: PlainFoldChange): PlainFoldState => {
  switch (change.type) {
    case 'assembled': return {...state, document: change.document};
    case 'loaded': return {...state, body: change.body};
    case 'grown': return {...state, height: change.height};
  }
};

type PlainFoldModule = {
  initial: PlainFoldState;
  reduce: (state: PlainFoldState, change: PlainFoldChange) => PlainFoldState;
};

export const plainFold: PlainFoldModule = {initial, reduce};
