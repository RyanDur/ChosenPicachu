import {FC, FormEvent, useContext, useEffect, useState} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {useNavigate} from 'react-router';
import {SearchOptions} from '@components/art-gallery/museums/types/response';
import {sourceParam} from '@components/art-gallery/museums/types/resource';
import * as schema from 'schemawax';
import {GalleryLinks} from '@components/art-gallery/Links';
import {debounce} from 'throttle-debounce';
import {has} from '@ryandur/sand';
import {art} from '@components/art-gallery/museums';
import './Search.css';
import searchIcon from '../../../assets/icons/search.png';
import resetIcon from '../../../assets/icons/reset.png';

type Props = {
  id?: string;
}

export const Search: FC<Props> = ({id}) => {
  const [searchOptions, updateSearchOptions] = useState<SearchOptions>([]);
  const [searchString, updateQuery] = useState<string>('');
  const navigate = useNavigate();
  const {gallery} = useContext(GalleryLinks);
  const {tab, search, removeSearchParams, createSearchParams} = useSearchParamsObject({tab: sourceParam, search: schema.string});
  const debounceSearch = debounce(300, (search: string) => {
    if (has(tab)) art.search({search, source: tab})
      .onSuccess(updateSearchOptions);
  });

  useEffect(() => {
    searchString && searchString.length && debounceSearch(searchString.toLowerCase());
  }, [searchString, debounceSearch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchString) void navigate({
      pathname: gallery,
      search: createSearchParams({search: searchString})
    });
  };

  const handleReset = () => removeSearchParams('search');

  return <search id={id} className="search void"><form className="search-form" onSubmit={handleSubmit} onReset={handleReset}>
    <label id="query-label" className='query-label paper ellipsis' htmlFor="query"><span className='bold'>Search For:</span> {decodeURI(search || '')}</label>
    <input type="search" autoComplete="off" list="search-options" id="query"
           className="query bare white"
           onInput={event => updateQuery(event.currentTarget.value)}/>
    <button className="submit-query icon-button borderless paper attentive" disabled={!searchString.length} type="submit"
            aria-label="submit search"><img src={searchIcon} alt=""/></button>
    <button className="reset-query icon-button borderless paper attentive" type="reset" aria-label="reset search"><img src={resetIcon} alt=""/></button>
    <datalist id="search-options" className="search-options paper">
      {searchOptions.map((searchOption, index) =>
        <option value={searchOption} key={index}>{searchOption}</option>)}
    </datalist>
  </form></search>;
};
