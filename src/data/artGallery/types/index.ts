import {GetAllArt, GetArt, SearchArt} from './resource';
import {OnAsyncEvent} from '@ryandur/sand';
import {AllArt, Art, SearchOptions} from './response';
import {Explanation, HTTPError} from '../../types';

export interface ArtGallery {
    getAllArt: (request: GetAllArt) => OnAsyncEvent<AllArt, Explanation<HTTPError>>;
    getArt: (request: GetArt) => OnAsyncEvent<Art, Explanation<HTTPError>>;
    searchForArt: (request: SearchArt) => OnAsyncEvent<SearchOptions, Explanation<HTTPError>>
}