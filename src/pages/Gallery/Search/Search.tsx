import {Dispatch, FC, SubmitEvent, useContext, useEffect, useId, useReducer} from 'react';
import {useNavigate} from 'react-router';
import {GalleryLinks} from '@pages/Gallery/Links';
import {classNames} from '@components';
import {maybe, Maybe, nothing, some} from '@ryandur/sand';
import {art, SearchOptions} from '@pages/Gallery/museums';
import {useGallery} from '@pages/Gallery/Context';
import {Source} from '@pages/Gallery/source';
import './Search.css';
import searchIcon from '../../../assets/icons/search.svg?url';
import resetIcon from '../../../assets/icons/reset.svg?url';

type Props = {
  className?: string;
};

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

export const Search: FC<Props> = ({className}) => {
  const [{typed, suggestions}, dispatch] = useReducer(nextDraft, blank);
  const navigate = useNavigate();
  const {gallery} = useContext(GalleryLinks);
  const {tab, search, removeSearchParams, searchFromAddress} = useGallery();
  const query = useId();
  const options = useId();

  useEffect(() => {
    if (typed === '') return () => undefined;
    return maybe(tab).map(source => afterAPause(() => suggestionsFor(typed, source, dispatch))).orElse(() => undefined);
  }, [typed, tab]);

  const submitted = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void navigate({
      pathname: gallery,
      search: searchFromAddress({search: typed})
    }, {preventScrollReset: true});
  };

  const reset = () => {
    dispatch(draftChange.cleared());
    removeSearchParams('search');
  };

  return <search className={classNames('search', 'backdrop', className)}>
    <form className="search-form" onSubmit={submitted} onReset={reset}>
      <label className="query-label field next-approached ellipsis" htmlFor={query}><span
        className="bold">Search For:</span> {maybe(search).orElse('')}</label>
      <input type="search" autoComplete="off" list={options} id={query} required
        className="query bare card"
        onInput={event => dispatch(draftChange.typed(event.currentTarget.value))}/>
      <button className="reset-query button icon-button borderless field attentive reachable" type="reset"
        aria-label="reset search"><img className="icon" src={resetIcon} width="24" height="24" alt=""/></button>
      <button className="submit-query button icon-button borderless field attentive reachable" type="submit"
        aria-label="submit search"><img className="icon" src={searchIcon} width="24" height="24" alt=""/></button>
      <datalist id={options} className="field">
        {suggestions.map(suggestion =>
          <option value={suggestion} key={suggestion}>{suggestion}</option>)}
      </datalist>
    </form>
  </search>;
};
