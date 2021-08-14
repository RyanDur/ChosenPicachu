import {FC, FormEvent, useEffect, useState} from 'react';
import {ArtSuggestion, AsyncState} from '../../../data/types';
import {data} from '../../../data';
import {SearchArtAction} from '../../../data/actions';
import {useHistory} from 'react-router-dom';
import './Search.scss';

interface Props {
    id?: string;
}

export const Search: FC<Props> = ({id}) => {
    const [searchOptions, updateSearchOptions] = useState<ArtSuggestion[]>([]);
    const [searchString, updateQuery] = useState<string>('');
    const history = useHistory();

    useEffect(() => {
        searchString && data.searchForArtOptions(searchString, (action: SearchArtAction) => {
            if (action.type === AsyncState.SUCCESS) updateSearchOptions(action.value);
        });
    }, [searchString]);

    const toQueryString = (params: { [k: string]: unknown } = {}): string => '?' + Object.entries(params)
        .map(([key, value]) => `${key}=${value}`).join('&');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchString && history.push({
            search: toQueryString({search: searchString})
        });
    };

    const handleReset = () => history.push({search: ''});

    return <form id={id} className="search" onSubmit={handleSubmit} onReset={handleReset} data-testid="search">
        <input list="search-options" placeholder="Search For" className="query" id={`query-${id}`}
               onInput={event => updateQuery(event.currentTarget.value)}/>
        <button className='reset-query' data-testid="reset-query" type="reset"/>
        <button className='submit-query' data-testid="submit-query" type="submit"/>
        <datalist id="search-options" data-testid="search-options">
            {searchOptions.map(searchOption =>
                <option value={searchOption} id={searchOption} key={searchOption}>{searchOption}</option>)}
        </datalist>
    </form>;
};