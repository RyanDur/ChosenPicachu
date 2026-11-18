import {Dispatch, useEffect, useReducer} from 'react';
import {maybe, Maybe, nothing, some} from '@ryandur/sand';
import {art, SearchOptions} from '@pages/Gallery/museums';
import {Source} from '@pages/Gallery/source';

const suggestionPause = 300;

type Draft = {typed: string; suggestions: SearchOptions};

type Typed = {readonly type: 'typed'; readonly words: string};
type Suggested = {readonly type: 'suggested'; readonly suggestions: SearchOptions};
type Cleared = {readonly type: 'cleared'};
type DraftChange = Typed | Suggested | Cleared;

const draftChange = {
  typed: (words: string): Typed => ({type: 'typed', words}),
  suggested: (suggestions: SearchOptions): Suggested => ({type: 'suggested', suggestions: [...new Set(suggestions)]}),
  cleared: (): Cleared => ({type: 'cleared'})
};

const suggestionsFor = (typed: string, source: Source, dispatch: Dispatch<DraftChange>) =>
  art.search({search: typed.toLowerCase(), source})
    .onSuccess(found => dispatch(draftChange.suggested(found)))
    .onFailure(() => dispatch(draftChange.suggested([])));

const blank: Draft = {typed: '', suggestions: []};

const nextDraft = (draft: Draft, change: DraftChange): Draft => {
  switch (change.type) {
    case 'typed':
      return {...draft, typed: change.words};
    case 'suggested':
      return {...draft, suggestions: change.suggestions};
    case 'cleared':
      return blank;
  }
};

const afterAPause = (ask: () => {cancel: () => void}): () => void => {
  let asked: Maybe<{cancel: () => void}> = nothing();
  const pause = setTimeout(() => {
    asked = some(ask());
  }, suggestionPause);
  return () => {
    clearTimeout(pause);
    asked.map(({cancel}) => cancel());
  };
};

export const useSuggestions = (tab?: Source) => {
  const [{typed, suggestions}, dispatch] = useReducer(nextDraft, blank);

  useEffect(() => {
    if (typed === '') return () => undefined;
    return maybe(tab).map(source => afterAPause(() => suggestionsFor(typed, source, dispatch))).orElse(() => undefined);
  }, [typed, tab]);

  return {
    suggestions,
    typed: (words: string): void => dispatch(draftChange.typed(words)),
    cleared: (): void => dispatch(draftChange.cleared())
  };
};
