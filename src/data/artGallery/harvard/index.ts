import {HarvardAllArt, HarvardSearch, HarvardArt} from './types';
import {AllArt, Art, SearchOptions} from '../types';

export const harvardToAllArt = ({info, records}: HarvardAllArt): AllArt => ({
    pagination: {
        total: info.totalrecords,
        limit: info.totalrecordsperquery,
        totalPages: info.pages,
        currentPage: info.page,
    },
    pieces: records.map(harvardArtToArt)
});

export const harvardArtToArt = (record: HarvardArt): Art => ({
    id: String(record.id),
    title: record.title,
    image: record.primaryimageurl,
    artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
    altText: record.title
});

export const harverdSearchToSearch = ({records}: HarvardSearch): SearchOptions =>
    records.map(({title}) => title);
