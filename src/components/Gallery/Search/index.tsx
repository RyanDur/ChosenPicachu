import {FC, FormEvent, useEffect, useState} from 'react';
import {data} from '../../../data';
import {SearchArtAction} from '../../../data/actions';
import {debounce} from 'lodash';
import {useQuery} from '../../hooks';
import {useHistory} from 'react-router-dom';
import {Paths} from '../../../App';
import {SearchOptions, Source} from '../../../data/sources/types';
import {AsyncState, Consumer} from '../../../data/types';
import './Search.scss';
import './Search.layout.scss';

interface Props {
    id?: string;
}

export const Search: FC<Props> = ({id}) => {
    const [searchOptions, updateSearchOptions] = useState<SearchOptions>([]);
    const [searchString, updateQuery] = useState<string>('');
    const history = useHistory();
    const {queryObj: {tab, search}, updateQueryString, nextQueryString} = useQuery<{ tab?: Source, search?: string }>();
    const debounceSearch = debounce((query: { search: string, source: Source }, consumer: Consumer<SearchArtAction>) =>
        data.searchForArtOptions(query, consumer), 300);

    useEffect(() => {
        searchString && debounceSearch({
            search: searchString.toLowerCase(),
            source: tab || '' as Source
        }, (action: SearchArtAction) => {
            if (action.type === AsyncState.LOADED) updateSearchOptions(action.value);
        });
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
        <label id="query-label" htmlFor="query">Search For {decodeURI(search || '')}</label>
        <input autoComplete="off" list="search-options" id="query"
               onInput={event => updateQuery(event.currentTarget.value)}/>
        <button className='reset-query' data-testid="reset-query" type="reset" aria-label="reset search"/>
        <button className='submit-query' data-testid="submit-query" type="submit" aria-label="submit search"/>
        <datalist id="search-options" data-testid="search-options">
            {searchOptions.map((searchOption, index) =>
                <option value={searchOption} key={index}>{searchOption}</option>)}
        </datalist>
    </form>;
};