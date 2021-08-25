import {data} from '../index';
import 'whatwg-fetch';
import {AICAutoCompleteResponse, AICPieceData, Piece, Source} from '../types';
import faker from 'faker';
import {
    aicArtResponse,
    fromAICArt,
    fromHarvardArt,
    harvardArtOptions,
    harvardArtResponse,
    harvardPiece,
    harvardPieceResponse,
    options
} from '../../__tests__/util';
import {nanoid} from 'nanoid';
import {error, loaded, loading} from '../actions';
import {failure, success} from '../http/actions';
import {http} from '../http';
import {HTTPError} from '../http/types';
import {waitFor} from '@testing-library/react';

jest.mock('../http', () => ({
    http: jest.fn(),
}));

describe('data', () => {
    const mockHttp = http as jest.Mock;
    describe('retrieving all the artwork', () => {
        describe('when the source is AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(aicArtResponse)));

                data.getAllArt({page: 1, size: 12, source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromAICArt)));
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(aicArtResponse)));

                data.getAllArt({page: 1, size: 12, search: 'rad', source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromAICArt)));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

                data.getAllArt({page: 1, size: 12, source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        describe('when the source is Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(harvardArtResponse)));

                data.getAllArt({page: 1, size: 12, source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromHarvardArt)));
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(harvardArtResponse)));

                data.getAllArt({page: 1, size: 12, search: 'rad', source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromHarvardArt)));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

                data.getAllArt({page: 1, size: 12, source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });
    });

    describe('retrieving an artwork', () => {
        describe('for AIC', () => {
            describe('when it is successful', () => {
                test('for a full response', async () => {
                    const dispatch = jest.fn();
                    mockHttp.mockReturnValue(Promise.resolve(success(pieceAICResponse)));

                    data.getPiece({id: String(aicPiece.id), source: Source.AIC}, dispatch);

                    expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                    await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(aicPiece)));
                });

                test('for a response without an image id', async () => {
                    const dispatch = jest.fn();
                    mockHttp.mockReturnValue(Promise.resolve(success(pieceAICResponseWithoutAnImageID)));

                    data.getPiece({id: String(aicPiece.id), source: Source.AIC}, dispatch);

                    expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                    await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(aicPieceWithoutAnImage)));
                });
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

                data.getPiece({id: String(aicPiece.id), source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(harvardPieceResponse)));

                data.getPiece({id: String(aicPiece.id), source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(harvardPiece)));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

                data.getPiece({id: String(aicPiece.id), source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });
    });

    describe('searching for art', () => {
        describe('for AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(aicArtOptions)));
                const search = faker.lorem.word();

                data.searchForArtOptions({search, source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(harvardArtOptions)));
                const search = faker.lorem.word();

                data.searchForArtOptions({search, source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
            });
        });
    });

    const pieceAICResponse: AICPieceData = {
        data: {
            id: Math.random(),
            title: faker.lorem.words(),
            image_id: nanoid(),
            term_titles: [faker.lorem.words()],
            artist_display: faker.lorem.sentence(),
            thumbnail: {alt_text: faker.lorem.sentence()}
        }
    };

    const pieceAICResponseWithoutAnImageID: AICPieceData = {data: {...pieceAICResponse.data, image_id: undefined}};

    const aicPiece: Piece = {
        id: pieceAICResponse.data.id,
        title: pieceAICResponse.data.title,
        image: `https://www.artic.edu/iiif/2/${pieceAICResponse.data.image_id}/full/2000,/0/default.jpg`,
        altText: pieceAICResponse.data.thumbnail?.alt_text!,
        artistInfo: pieceAICResponse.data.artist_display
    };

    const aicPieceWithoutAnImage: Piece = {...aicPiece, image: undefined};

    const pagination = {
        total: fromAICArt.pagination.total,
        limit: fromAICArt.pagination.limit,
        offset: fromAICArt.pagination.offset,
        total_pages: fromAICArt.pagination.totalPages,
        current_page: fromAICArt.pagination.currentPage,
        next_url: fromAICArt.pagination.nextUrl
    };

    const aicArtOptions: AICAutoCompleteResponse = {
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