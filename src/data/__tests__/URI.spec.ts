import {shapeOfAICResponse, shapeOfHarvardResponse, URI} from '../URI';
import * as faker from 'faker';
import {Source} from '../types';
import {toQueryString} from '../../util/URL';
import {aicDomain, harvardAPIKey, harvardDomain} from '../../config';
import {nanoid} from 'nanoid';

const mockHarvardDomain = jest.fn();
const mockAICDomain = jest.fn();
const mockHarvardAPIKey = jest.fn();

jest.mock('../../config', () => ({
    get aicDomain() {
        return mockAICDomain();
    },
    get harvardDomain() {
        return mockHarvardDomain();
    },
    get harvardAPIKey() {
        return mockHarvardAPIKey();
    }
}));

describe('the URI', () => {
    beforeEach(() => {
        mockAICDomain.mockReturnValue('/art/institute');
        mockHarvardDomain.mockReturnValue('/from/harvard');
        mockHarvardAPIKey.mockReturnValue(nanoid());
    });

    it('should create the appropriate URI for the Art Institute', () => {
        const searchQuery = {params: {search: faker.lorem.words(), page: 1, limit: 56}, source: Source.AIC};
        const {search, limit, ...rest} = searchQuery.params;
        expect(URI.from(searchQuery))
            .toEqual(`${aicDomain}/search${toQueryString({
                q: search,
                fields: shapeOfAICResponse, ...rest,
                limit
            })}`);

        const query = {params: {page: 1, limit: 123}, source: Source.AIC};
        expect(URI.from(query))
            .toEqual(`${aicDomain}${toQueryString({
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

        expect(URI.from(searchQuery))
            .toEqual(`${harvardDomain}${toQueryString({
                q: search,
                fields: shapeOfHarvardResponse, ...rest,
                size: limit
            })}`);

        const query = {params: {page: 1, apikey: harvardAPIKey, limit}, source: Source.HARVARD};
        expect(URI.from(query))
            .toEqual(`${harvardDomain}${toQueryString({
                fields: shapeOfHarvardResponse,
                page: query.params.page,
                apikey: query.params.apikey,
                size: query.params.limit
            })}`);
    });

    it('should allow to add a path', () => {
        const query = {params: {page: 1, limit: 456}, path: '/more/path', source: Source.AIC};
        expect(URI.from(query))
            .toEqual(`${aicDomain}${query.path}${toQueryString({
                fields: shapeOfAICResponse,
                page: query.params.page,
                limit: 456
            })}`);
    });

    it('should be able to override the fields', () => {
        const query = {params: {page: 1, fields: ['blah'], limit: 23}, path: '/more/path', source: Source.AIC};
        expect(URI.from(query))
            .toEqual(`${aicDomain}${query.path}${toQueryString({
                fields: ['blah'],
                page: query.params.page,
                limit: 23
            })}`);
    });

    describe('createSearchFrom', () => {
        it('should create the aic search url', () => {
            const search = faker.lorem.words();
            expect(URI.createSearchFrom(search, Source.AIC))
                .toEqual(`${aicDomain}/search${toQueryString({
                    'query[term][title]': search,
                    fields: 'suggest_autocomplete_all',
                    limit: 5
                })}`);
        });

        it('should create the harvard search url', () => {
            const search = faker.lorem.words();
            expect(URI.createSearchFrom(search, Source.HARVARD))
                .toEqual(`${harvardDomain}${toQueryString({
                    title: search,
                    fields: 'title',
                    apikey: harvardAPIKey,
                    size: 5
                })}`);
        });
    });
});