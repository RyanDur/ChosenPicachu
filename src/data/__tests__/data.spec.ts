import {data} from '../index';
import 'whatwg-fetch';
import {
    AICPieceData,
    Piece,
    Source
} from '../types';
import faker from 'faker';
import {
    aicArtResponse,
    fromAICArt,
    fromHarvardArt,
    fromRIJKArt,
    fromRIJKArtOptionsResponse,
    fromRIJKArtResponse,
    fromRIJKToPiece,
    harvardArtOptions,
    harvardArtResponse,
    harvardPiece,
    harvardPieceResponse,
    options,
    rijkArtObjectResponse
} from '../../__tests__/util';
import {nanoid} from 'nanoid';
import {error, loaded, loading} from '../actions';
import {failure, success} from '../http/actions';
import {http} from '../http';
import {HTTPError} from '../http/types';
import {waitFor} from '@testing-library/react';
import {URI} from '../URI';
import {AICAllArtResponseDecoder, AICArtResponseDecoder, AICAutoCompleteResponseDecoder} from '../types/AIC';
import {HarvardAutoCompleteDecoder, HarvardArtDecoder, HarvardAllArtDecoder} from '../types/Harvard';
import {RIJKAllArtDecoder, RIJKArtDecoder} from '../types/RIJK';

jest.mock('../http', () => ({
    http: jest.fn(),
}));

describe('data', () => {
    const mockHttp = http as jest.Mock;
    const mockURIFrom = faker.lorem.word();
    beforeEach(() => {
        URI.from = () => mockURIFrom;
        URI.createSearchFrom = () => mockURIFrom;
    });

    describe('retrieving all the artwork', () => {
        describe('when the source is AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(aicArtResponse)));

                data.getAllArt({page: 1, size: 12, source: Source.AIC}, dispatch);

                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: AICAllArtResponseDecoder});
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

                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: HarvardAllArtDecoder});
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

        describe('when the source is RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(fromRIJKArtResponse)));

                data.getAllArt({page: 1, size: 12, source: Source.RIJK}, dispatch);

                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: RIJKAllArtDecoder});
                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromRIJKArt(1, 12))));
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(fromRIJKArtResponse)));

                data.getAllArt({page: 1, size: 12, search: 'rad', source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromRIJKArt(1, 12))));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

                data.getAllArt({page: 1, size: 12, source: Source.RIJK}, dispatch);

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
                    expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: AICArtResponseDecoder});
                    await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(aicPiece)));
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
                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: HarvardArtDecoder});
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

        describe('for RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(rijkArtObjectResponse)));

                data.getPiece({id: String(aicPiece.id), source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: RIJKArtDecoder});
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromRIJKToPiece(rijkArtObjectResponse.artObject))));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

                data.getPiece({id: String(aicPiece.id), source: Source.RIJK}, dispatch);

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
                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: AICAutoCompleteResponseDecoder});
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
                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: HarvardAutoCompleteDecoder});
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
            });
        });

        describe('for RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(fromRIJKArtOptionsResponse)));
                const search = faker.lorem.word();

                data.searchForArtOptions({search, source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                expect(mockHttp).toHaveBeenCalledWith({url: mockURIFrom, decoder: RIJKArtDecoder});
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

    const aicPiece: Piece = {
        id: String(pieceAICResponse.data.id),
        title: pieceAICResponse.data.title,
        image: `https://www.artic.edu/iiif/2/${pieceAICResponse.data.image_id}/full/2000,/0/default.jpg`,
        altText: pieceAICResponse.data.thumbnail?.alt_text!,
        artistInfo: pieceAICResponse.data.artist_display
    };

    const pagination = {
        total: fromAICArt.pagination.total,
        limit: fromAICArt.pagination.limit,
        total_pages: fromAICArt.pagination.totalPages,
        current_page: fromAICArt.pagination.currentPage,
    };

    const aicArtOptions = {
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