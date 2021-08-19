import {FC, FormEvent, useEffect, useState} from 'react';
import {ArtSuggestion, AsyncState} from '../../../data/types';
import {data} from '../../../data';
import {SearchArtAction} from '../../../data/actions';
import {useHistory} from 'react-router-dom';
import {toQueryString} from '../../../util/URL';
import {Paths} from '../../../App';
import {debounce} from 'lodash';
import {Consumer} from '../../UserInfo/types';
import './Search.scss';
import './Search.layout.scss';

interface Props {
    id?: string;
}

export const Search: FC<Props> = ({id}) => {
    const [searchOptions, updateSearchOptions] = useState<ArtSuggestion[]>([]);
    const [searchString, updateQuery] = useState<string>('');
    const history = useHistory();
    const debounceSearch = debounce((query: string, consumer: Consumer<SearchArtAction>) =>
        data.searchForArtOptions(query, consumer), 300);

    useEffect(() => {
        searchString && debounceSearch(searchString.toLowerCase(), (action: SearchArtAction) => {
            if (action.type === AsyncState.LOADED) updateSearchOptions(action.value);
        });
    }, [searchString]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchString && history.push({
            pathname: Paths.artGallery,
            search: toQueryString({search: searchString})
        });
    };

    const handleReset = () => history.push({
        pathname: Paths.artGallery,
        search: ''
    });

    return <form id={id} className="search" onSubmit={handleSubmit} onReset={handleReset} data-testid="search">
        <button className='reset-query' data-testid="reset-query" type="reset" aria-label="reset search"/>
        <input autoComplete="off" list="search-options" placeholder="Search For" className="query" id={`query-${id}`}
               onInput={event => updateQuery(event.currentTarget.value)}/>
        <button className='submit-query' data-testid="submit-query" type="submit" aria-label="submit search"/>
        <datalist id="search-options" data-testid="search-options">
            {searchOptions.map((searchOption, index) =>
                <option value={searchOption} key={index}>{searchOption}</option>)}
        </datalist>
    </form>;
};