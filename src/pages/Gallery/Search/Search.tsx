import {FC, SubmitEvent, useContext, useEffect, useId, useState} from 'react';
import {useNavigate} from 'react-router';
import {GalleryLinks} from '@pages/Gallery/Links';
import {classNames} from '@components';
import {maybe, Maybe, nothing, some} from '@ryandur/sand';
import {art, SearchOptions} from '@pages/Gallery/museums';
import {useGallery} from '@pages/Gallery/Context';
import './Search.css';
import searchIcon from '../../../assets/icons/search.svg?url';
import resetIcon from '../../../assets/icons/reset.svg?url';

type Props = {
  id?: string;
  className?: string;
};

const suggestionPause = 300;

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

export const Search: FC<Props> = ({id, className}) => {
  const [searchOptions, updateSearchOptions] = useState<SearchOptions>([]);
  const [searchString, updateQuery] = useState<string>('');
  const navigate = useNavigate();
  const {gallery} = useContext(GalleryLinks);
  const {tab, search, removeSearchParams, searchFromAddress} = useGallery();
  const query = useId();
  const options = useId();

  const noSuggestions = () => updateSearchOptions([]);

  useEffect(() => {
    if (searchString === '') return () => undefined;
    return maybe(tab).map(source => afterAPause(() => art.search({search: searchString.toLowerCase(), source})
      .onSuccess(updateSearchOptions)
      .onFailure(noSuggestions))).orElse(() => undefined);
  }, [searchString, tab]);

  const submitted = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void navigate({
      pathname: gallery,
      search: searchFromAddress({search: searchString})
    }, {preventScrollReset: true});
  };

  const reset = () => {
    updateQuery('');
    updateSearchOptions([]);
    removeSearchParams('search');
  };

  return <search id={id} className={classNames('search', 'backdrop', className)}>
    <form className="search-form" onSubmit={submitted} onReset={reset}>
      <label className="query-label field next-approached ellipsis" htmlFor={query}><span
        className="bold">Search For:</span> {search ?? ''}</label>
      <input type="search" autoComplete="off" list={options} id={query} required
        className="query bare card"
        onInput={event => updateQuery(event.currentTarget.value)}/>
      <button className="reset-query button icon-button borderless field attentive reachable" type="reset"
        aria-label="reset search"><img className="icon" src={resetIcon} width="24" height="24" alt=""/></button>
      <button className="submit-query button icon-button borderless field attentive reachable" type="submit"
        aria-label="submit search"><img className="icon" src={searchIcon} width="24" height="24" alt=""/></button>
      <datalist id={options} className="field">
        {searchOptions.map((searchOption, index) =>
          <option value={searchOption} key={index}>{searchOption}</option>)}
      </datalist>
    </form>
  </search>;
};
