import {GetAllArt, GetArt, SearchArt} from './resource';
import {OnAsyncEvent} from '@ryandur/sand';
import {AllArt, Art, SearchOptions} from './response';
import {Explanation, HTTPError} from '../../types';
import {AICAllArt, AICPieceData, AICSearch} from '../aic/types';
import {HarvardAllArt, HarvardArt, HarvardSearch} from '../harvard/types';
import {RIJKSAllArt, RIJKSArt} from '../rijks/types';
import {AllArtRequest, ArtRequest, SearchOptionsRequest} from './request';

export type AllArtRequests = AllArtRequest<AICAllArt> | AllArtRequest<HarvardAllArt> | AllArtRequest<RIJKSAllArt>;
export type ArtRequests = ArtRequest<AICPieceData> | ArtRequest<HarvardArt> | ArtRequest<RIJKSArt>;
export type SearchOptionsRequests = SearchOptionsRequest<AICSearch> | SearchOptionsRequest<HarvardSearch> | SearchOptionsRequest<RIJKSAllArt>;

export interface ArtGallery {
    getAllArt: (request: GetAllArt) => OnAsyncEvent<AllArt, Explanation<HTTPError>>;
    getArt: (request: GetArt) => OnAsyncEvent<Art, Explanation<HTTPError>>;
    searchForArt: (request: SearchArt) => OnAsyncEvent<SearchOptions, Explanation<HTTPError>>
}