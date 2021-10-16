import {FC, FormEvent, useEffect, useState} from 'react';
import {data} from '../../../data';
import {debounce} from 'lodash';
import {useQuery} from '../../hooks';
import {useHistory} from 'react-router-dom';
import {Paths} from '../../../App';
import {SearchOptions} from '../../../data/artGallery/types/response';
import {Source} from '../../../data/artGallery/types/resource';
import './Search.scss';
import './Search.layout.scss';

interface Props {
    id?: string;
}

export const Search: FC<Props> = ({id}) => {
    const [searchOptions, updateSearchOptions] = useState<SearchOptions>([]);
    const [searchString, updateQuery] = useState<string>('');
    const history = useHistory();
    const {queryObj: {tab, search}, updateQueryString, nextQueryString} = useQuery<{ tab: Source, search?: string }>();
    const debounceSearch = debounce(search =>
        data.artGallery.searchForArt({search, source: tab})
            .onSuccess(updateSearchOptions), 300);

    useEffect(() => {
        searchString && debounceSearch(searchString.toLowerCase());
    }, [searchString]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchString && history.push({
            pathname: Paths.artGallery,
            search: nextQueryString({search: searchString})
        });
    };

    const handleReset = () => updateQueryString({search: undefined});

    return <form id={id} className="search" onSubmit={handleSubmit} onReset={handleReset} data-testid="search">
        <input autoComplete="off" list="search-options" id="query"
               onInput={event => updateQuery(event.currentTarget.value)}/>
        <label id="query-label" htmlFor="query">Search For {decodeURI(search || '')}</label>
        <button className='reset-query' data-testid="reset-query" type="reset" aria-label="reset search"/>
        <button className='submit-query' data-testid="submit-query" type="submit" aria-label="submit search"/>
        <datalist id="search-options" data-testid="search-options">
            {searchOptions.map((searchOption, index) =>
                <option value={searchOption} key={index}>{searchOption}</option>)}
        </datalist>
    </form>;
};