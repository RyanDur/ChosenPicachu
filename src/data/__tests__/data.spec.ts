import {data} from '../index';
import {mockServer, MockWebServer} from './mockServer';
import 'whatwg-fetch';
import {ArtResponse, ArtSuggestion, AutoCompleteResponse, Piece, PieceResponse} from '../types';
import faker from 'faker';
import {art} from '../../__tests__/util';
import {nanoid} from 'nanoid';
import {waitFor} from '@testing-library/react';
import {error, loading, success} from '../actions';

const mockConfig = jest.fn();
jest.mock('../../config', () => ({
    get domain() {
        return mockConfig();
    }
}));

describe('data', () => {
    const fields = 'fields=id,title,image_id,artist_display,term_titles,thumbnail';
    let server: MockWebServer;

    beforeEach(() => {
        server = mockServer();
        server.start();
        mockConfig.mockReturnValue(server.path());
    });

    afterEach(() => server.stop());

    describe('retrieving all the artwork', () => {
        test('when it is successful', async () => {
            const dispatch = jest.fn();
            server.stubResponse(200, artResponse);

            data.getAllArt({page: 1}, dispatch);

            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks?page=1&${fields}&limit=12`);
                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                expect(dispatch).toHaveBeenNthCalledWith(2, success(art));
            });
        });

        test('when it has a search term', async () => {
            const dispatch = jest.fn();
            server.stubResponse(200, artResponse);

            data.getAllArt({page: 1, search: 'rad'}, dispatch);
            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks/search?q=rad&page=1&${fields}&limit=12`);
                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                expect(dispatch).toHaveBeenNthCalledWith(2, success(art));
            });
        });

        test('when it is not successful', async () => {
            const dispatch = jest.fn();
            server.stubResponse(500, {});

            data.getAllArt({page: 1}, dispatch);

            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks?page=1&${fields}&limit=12`);
                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                expect(dispatch).toHaveBeenNthCalledWith(2, error());
            });
        });
    });

    describe('retrieving an artwork', () => {
        test('when it is successful', async () => {
            const dispatch = jest.fn();
            server.stubResponse(200, pieceResponse);

            data.getPiece(String(piece.id), dispatch);

            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks/${pieceResponse.data.id}?${fields}`);
                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                expect(dispatch).toHaveBeenNthCalledWith(2, success(piece));
            });
        });

        test('when it is not successful', async () => {
            const dispatch = jest.fn();
            server.stubResponse(500, {});

            data.getPiece(String(piece.id), dispatch);

            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks/${pieceResponse.data.id}?${fields}`);
                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                expect(dispatch).toHaveBeenNthCalledWith(2, error());
            });
        });
    });

    describe('searching for art', () => {
        test('when it is successful', async () => {
            const dispatch = jest.fn();
            server.stubResponse(200, artOptions);
            const searchString = faker.lorem.word();

            data.searchForArtOptions(searchString, dispatch);

            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks/search?query[term][title]=${searchString}&fields=suggest_autocomplete_all&limit=5`);
                expect(dispatch).toHaveBeenNthCalledWith(1, success(options));
            });
        });
    });

    const pieceResponse: PieceResponse = {
        data: {
            id: Math.random(),
            title: faker.lorem.words(),
            image_id: nanoid(),
            term_titles: [faker.lorem.words()],
            artist_display: faker.lorem.sentence(),
            thumbnail: {alt_text: faker.lorem.sentence()}
        }
    };

    const piece: Piece = {
        id: pieceResponse.data.id,
        title: pieceResponse.data.title,
        imageId: pieceResponse.data.image_id,
        altText: pieceResponse.data.thumbnail?.alt_text!,
        artistInfo: pieceResponse.data.artist_display
    };

    const pagination = {
        total: art.pagination.total,
        limit: art.pagination.limit,
        offset: art.pagination.offset,
        total_pages: art.pagination.totalPages,
        current_page: art.pagination.currentPage,
        next_url: art.pagination.nextUrl
    };

    const artResponse: ArtResponse = {
        pagination,
        data: art.pieces.map(piece => ({
            id: piece.id,
            title: piece.title,
            image_id: piece.imageId,
            artist_display: piece.artistInfo,
            term_titles: piece.altText.split(' ')
        })),
        info: {
            license_text: faker.lorem.sentence(),
            license_links: [faker.internet.url()],
            version: '1.1'
        },
        config: {
            iiif_url: faker.internet.url()
        }
    };

    const options: ArtSuggestion[] = [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()];
    const artOptions: AutoCompleteResponse = {
        pagination,
        data: options.map(option => ({
            suggest_autocomplete_all: [{
                input: [faker.lorem.word()],
                contexts: {
                    groupings: [faker.lorem.word()]
                }
            }, {
                input: [option],
                weight: Math.floor(Math.random() * 10_000),
                contexts: {
                    groupings: [faker.lorem.word()]
                }
            }]
        }))
    };
});