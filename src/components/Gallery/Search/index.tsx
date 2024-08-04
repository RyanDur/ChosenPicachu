import {FC, FormEvent, useEffect, useState} from 'react';
import {data} from '../../../data';
import {useQuery} from '../../hooks';
import {useNavigate} from 'react-router-dom';
import {SearchOptions} from '../../../data/artGallery/types/response';
import {Source} from '../../../data/artGallery/types/resource';
import {Paths} from '../../../routes/Paths.ts';
import {debounce} from 'throttle-debounce';
import './Search.css';
import './Search.layout.css';

interface Props {
  id?: string;
}

export const Search: FC<Props> = ({id}) => {
  const [searchOptions, updateSearchOptions] = useState<SearchOptions>([]);
  const [searchString, updateQuery] = useState<string>('');
  const navigate = useNavigate();
  const {queryObj: {tab, search}, updateQueryString, nextQueryString} = useQuery<{ tab: Source, search?: string }>();
  const debounceSearch = debounce(300, search =>
    data.artGallery.searchForArt({search, source: tab})
      .onSuccess(updateSearchOptions));

  useEffect(() => {
    searchString && searchString.length && debounceSearch(searchString.toLowerCase());
  }, [searchString]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchString && navigate({
      pathname: Paths.artGallery,
      search: nextQueryString({search: searchString})
    });
  };

  const handleReset = () => updateQueryString({search: undefined});

  return <form id={id} className="search" onSubmit={handleSubmit} onReset={handleReset} data-testid="search">
    <input autoComplete="off" list="search-options" id="query"
           onInput={event => updateQuery(event.currentTarget.value)}/>
    <label id="query-label" htmlFor="query">Search For {decodeURI(search || '')}</label>
    <button className="reset-query" data-testid="reset-query" type="reset" aria-label="reset search"/>
    <button className="submit-query" data-testid="submit-query" disabled={!searchString.length} type="submit"
            aria-label="submit search"/>
    <datalist id="search-options" data-testid="search-options">
      {searchOptions.map((searchOption, index) =>
        <option value={searchOption} key={index}>{searchOption}</option>)}
    </datalist>
  </form>;
};
