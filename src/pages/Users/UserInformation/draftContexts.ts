import {Dispatch, createContext} from 'react';
import {DraftAction} from './draftActions';
import {Draft, drafts} from './drafts';

type DraftContext = {
  readonly draft: Draft;
  readonly dispatch: Dispatch<DraftAction>;
};

export const draftContexts = {
  Draft: createContext<DraftContext>({draft: drafts.of(drafts.newUser('')), dispatch: () => undefined})
};
