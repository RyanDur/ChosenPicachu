import {
    HarvardAllArt,
    HarvardAllArtSchema,
    HarvardArt,
    HarvardArtSchema,
    HarvardSearch,
    HarvardSearchSchema
} from './types';
import {AllArt, Art, SearchOptions} from '../types';
import {validate} from '../../http';

export const harvardArtToArt = (record: HarvardArt): Art => ({
    id: String(record.id),
    title: record.title,
    image: record.primaryimageurl,
    artistInfo: record.people?.find(person => person.role === 'Artist')?.displayname || 'Unknown',
    altText: record.title
});

export const harvard = {
    response: {
        toAllArt: ({info, records}: HarvardAllArt): AllArt => ({
            pagination: {
                total: info.totalrecords,
                limit: info.totalrecordsperquery,
                totalPages: info.pages,
                currentPage: info.page,
            },
            pieces: records.map(harvardArtToArt)
        }),

        toArt: harvardArtToArt,

        toSearchOptions: ({records}: HarvardSearch): SearchOptions =>
            records.map(({title}) => title),
    },
    validate: {
        allArt: validate(HarvardAllArtSchema),
        art: validate(HarvardArtSchema),
        searchOptions: validate(HarvardSearchSchema)
    }
};
