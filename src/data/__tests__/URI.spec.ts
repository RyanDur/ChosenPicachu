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
        const searchQuery = {params: {search: faker.lorem.words(), page: 1}, source: Source.AIC};
        const {search, ...rest} = searchQuery.params;
        expect(URI.from(searchQuery))
            .toEqual(`${aicDomain}/search${toQueryString({
                q: search,
                fields: shapeOfAICResponse, ...rest,
                limit: 12
            })}`);

        const query = {params: {page: 1}, source: Source.AIC};
        expect(URI.from(query))
            .toEqual(`${aicDomain}${toQueryString({fields: shapeOfAICResponse, page: query.params.page, limit: 12})}`);
    });

    it('should create the appropriate URI for Harvard', () => {
        const searchQuery = {
            params: {page: 1, apikey: harvardAPIKey, search: faker.lorem.words()},
            source: Source.HARVARD
        };
        const {search, ...rest} = searchQuery.params;

        expect(URI.from(searchQuery))
            .toEqual(`${harvardDomain}${toQueryString({
                q: search,
                fields: shapeOfHarvardResponse, ...rest,
                size: 12
            })}`);

        const query = {params: {page: 1, apikey: harvardAPIKey}, source: Source.HARVARD};
        expect(URI.from(query))
            .toEqual(`${harvardDomain}${toQueryString({fields: shapeOfHarvardResponse, ...query.params, size: 12})}`);
    });

    it('should allow to add a path', () => {
        const query = {params: {page: 1}, path: '/more/path', source: Source.AIC};
        expect(URI.from(query))
            .toEqual(`${aicDomain}${query.path}${toQueryString({
                fields: shapeOfAICResponse,
                page: query.params.page,
                limit: 12
            })}`);
    });

    it('should be able to override the fields', () => {
        const query = {params: {page: 1, fields: ['blah']}, path: '/more/path', source: Source.AIC};
        expect(URI.from(query))
            .toEqual(`${aicDomain}${query.path}${toQueryString({
                fields: ['blah'],
                page: query.params.page,
                limit: 12
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