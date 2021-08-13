import {useEffect, useState} from 'react';
import {ArtSuggestion, AsyncState} from '../../../data/types';
import {data} from '../../../data';
import {SearchArtAction} from '../../../data/actions';
import {useHistory} from 'react-router-dom';

export const Search = () => {
    const [searchOptions, updateSearchOptions] = useState<ArtSuggestion[]>([]);
    const [searchString, updateQuery] = useState<string>('');
    const history = useHistory();

    useEffect(() => {
        data.searchForArtOptions(searchString, (action: SearchArtAction) => {
            if (action.type === AsyncState.SUCCESS) updateSearchOptions(action.value);
        });
    }, [searchString]);


    return <form onSubmit={event => {
        event.preventDefault();
        history.push({search: `?search=${searchString}`});
    }}>
        <label htmlFor="search">Search For</label>
        <input type="list" id="search" onChange={event => updateQuery(event.currentTarget.value)}/>
        <datalist data-testid="search-options">
            {searchOptions.map(searchOption =>
                <option value={searchOption} key={searchOption}>{searchOption}</option>)}
        </datalist>
        <button type="submit">Search</button>
    </form>;
};