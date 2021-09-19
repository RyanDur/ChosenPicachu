import * as faker from 'faker';
import {aicDomain, defaultSearchLimit, harvardAPIKey, harvardDomain, rijksAPIKey, rijksDomain} from '../../../config';
import {nanoid} from 'nanoid';
import {shapeOfAICResponse, shapeOfHarvardResponse, URI} from '../URI';
import {toQueryString} from '../../../util/URL';
import {Source} from '../types';

const mockHarvardDomain = jest.fn();
const mockAICDomain = jest.fn();
const mockHarvardAPIKey = jest.fn();
const mockRijksDomain = jest.fn();
const mockRijksAPIKey = jest.fn();

jest.mock('../../../config', () => ({
    get aicDomain() {
        return mockAICDomain();
    },
    get harvardDomain() {
        return mockHarvardDomain();
    },
    get harvardAPIKey() {
        return mockHarvardAPIKey();
    },
    get rijksDomain() {
        return mockRijksDomain();
    },
    get rijksAPIKey() {
        return mockRijksAPIKey();
    },
    get defaultSearchLimit() {
        return 5;
    }
}));

describe('the URI', () => {
    beforeEach(() => {
        mockAICDomain.mockReturnValue('/from/art/institute');
        mockHarvardDomain.mockReturnValue('/from/harvard');
        mockRijksDomain.mockReturnValue('/from/rijks');
        mockHarvardAPIKey.mockReturnValue(nanoid());
        mockRijksAPIKey.mockReturnValue(nanoid());
    });

    it('should create the appropriate URI for the Art Institute', () => {
        const searchQuery = {params: {search: faker.lorem.words(), page: 1, limit: 56}, source: Source.AIC};
        const {search, limit, ...rest} = searchQuery.params;
        expect(URI.from(searchQuery).orNull())
            .toEqual(`${aicDomain}/search${toQueryString({
                q: search,
                fields: shapeOfAICResponse, ...rest,
                limit
            })}`);

        const query = {params: {page: 1, limit: 123}, source: Source.AIC};
        expect(URI.from(query).orNull())
            .toEqual(`${aicDomain}${toQueryString({
                fields: shapeOfAICResponse,
                page: query.params.page,
                limit: query.params.limit
            })}`);

        const anotherQuery = {params: {page: 1, limit: 123}, path: [1], source: Source.AIC};
        expect(URI.from(anotherQuery).orNull())
            .toEqual(`${aicDomain}/${anotherQuery.path.join('/')}${toQueryString({
                fields: shapeOfAICResponse,
                page: query.params.page,
                limit: query.params.limit
            })}`);
    });

    it('should create the appropriate URI for Harvard', () => {
        const searchQuery = {
            params: {page: 1, limit: 4, apikey: harvardAPIKey, search: faker.lorem.words()},
            source: Source.HARVARD
        };
        const {search, limit, ...rest} = searchQuery.params;

        expect(URI.from(searchQuery).orNull())
            .toEqual(`${harvardDomain}${toQueryString({
                q: search,
                fields: shapeOfHarvardResponse, ...rest,
                size: limit
            })}`);

        const query = {params: {page: 1, apikey: harvardAPIKey, limit}, source: Source.HARVARD};
        expect(URI.from(query).orNull())
            .toEqual(`${harvardDomain}${toQueryString({
                fields: shapeOfHarvardResponse,
                page: query.params.page,
                apikey: query.params.apikey,
                size: query.params.limit
            })}`);

        const anotherQuery = {params: {page: 1, apikey: harvardAPIKey, limit}, path: [1], source: Source.HARVARD};
        expect(URI.from(anotherQuery).orNull())
            .toEqual(`${harvardDomain}/${anotherQuery.path.join('/')}${toQueryString({
                fields: shapeOfHarvardResponse,
                page: query.params.page,
                apikey: query.params.apikey,
                size: query.params.limit
            })}`);
    });

    it('should create the appropriate URI for RIJKS', () => {
        const searchQuery = {
            params: {page: 1, limit: 4, apikey: rijksAPIKey, search: faker.lorem.words()},
            source: Source.RIJKS
        };
        const {search, limit, apikey, page} = searchQuery.params;

        expect(URI.from(searchQuery).orNull())
            .toEqual(`${rijksDomain}${toQueryString({
                q: search,
                p: page,
                ps: limit,
                imgonly: true,
                key: apikey
            })}`);

        const query = {params: {page: 1, apikey: rijksAPIKey, limit}, source: Source.RIJKS};
        expect(URI.from(query).orNull())
            .toEqual(`${rijksDomain}${toQueryString({
                p: query.params.page,
                ps: query.params.limit,
                imgonly: true,
                key: query.params.apikey
            })}`);

        const anotherQuery = {params: {page: 1, apikey: rijksAPIKey, limit}, path: [1], source: Source.RIJKS};
        expect(URI.from(anotherQuery).orNull())
            .toEqual(`${rijksDomain}/${anotherQuery.path.join('/')}${toQueryString({
                p: query.params.page,
                ps: query.params.limit,
                imgonly: true,
                key: query.params.apikey
            })}`);
    });

    it('should allow to add a path', () => {
        const query = {params: {page: 1, limit: 456}, path: ['more', 'path'], source: Source.AIC};
        expect(URI.from(query).orNull())
            .toEqual(`${[aicDomain, query.path.join('/')].join('/')}${toQueryString({
                fields: shapeOfAICResponse,
                page: query.params.page,
                limit: 456
            })}`);
    });

    it('should be able to override the fields', () => {
        const query = {params: {page: 1, fields: ['blah'], limit: 23}, path: ['more', 'path'], source: Source.AIC};
        expect(URI.from(query).orNull())
            .toEqual(`${[aicDomain, query.path.join('/')].join('/')}${toQueryString({
                fields: ['blah'],
                page: query.params.page,
                limit: 23
            })}`);
    });

    describe('createSearchFrom', () => {
        it('should create the aic search url', () => {
            const search = faker.lorem.words();
            expect(URI.createSearchFrom(search, Source.AIC).orNull())
                .toEqual(`${aicDomain}/search${toQueryString({
                    'query[term][title]': search,
                    fields: 'suggest_autocomplete_all',
                    limit: defaultSearchLimit
                })}`);
        });

        it('should create the harvard search url', () => {
            const search = faker.lorem.words();
            expect(URI.createSearchFrom(search, Source.HARVARD).orNull())
                .toEqual(`${harvardDomain}${toQueryString({
                    title: search,
                    fields: 'title',
                    apikey: harvardAPIKey,
                    size: defaultSearchLimit
                })}`);
        });

        it('should create the rijks search url', () => {
            const search = faker.lorem.words();
            expect(URI.createSearchFrom(search, Source.RIJKS).orNull())
                .toEqual(`${rijksDomain}${toQueryString({
                    q: search,
                    p: 1,
                    ps: 5,
                    imgonly: true,
                    key: rijksAPIKey
                })}`);
        });
    });
});
