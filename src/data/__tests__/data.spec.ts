import {data} from '../index';
import 'whatwg-fetch';
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
import {http} from '../http';
import {waitFor} from '@testing-library/react';
import {asyncResult} from '@ryandur/sand';
import {Piece, Source} from '../sources/types';
import {AICSearchResponse, AICPieceData} from '../sources/aic/types';
import {HTTPError} from '../types';

jest.mock('../http', () => ({
    http: jest.fn(),
}));

describe('data', () => {
    const mockHttp = http as jest.Mock;

    const mockSuccess = (response: any) =>
        mockHttp.mockReturnValue(asyncResult.success(response));
    const mockFailure = (response: any) =>
        mockHttp.mockReturnValue(asyncResult.failure(response));

    describe('retrieving all the artwork', () => {
        describe('when the source is AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(aicArtResponse);

                data.getAllArt({page: 1, size: 12, source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromAICArt)));
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockSuccess(aicArtResponse);

                data.getAllArt({page: 1, size: 12, search: 'rad', source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromAICArt)));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                data.getAllArt({page: 1, size: 12, source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        describe('when the source is Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardArtResponse);

                data.getAllArt({page: 1, size: 12, source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromHarvardArt)));
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardArtResponse);

                data.getAllArt({page: 1, size: 12, search: 'rad', source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromHarvardArt)));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                data.getAllArt({page: 1, size: 12, source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        describe('when the source is RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(fromRIJKArtResponse);

                data.getAllArt({page: 1, size: 12, source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromRIJKArt(1, 12))));
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockSuccess(fromRIJKArtResponse);

                data.getAllArt({page: 1, size: 12, search: 'rad', source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromRIJKArt(1, 12))));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                data.getAllArt({page: 1, size: 12, source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        test('when the source does not exist', async () => {
            const dispatch = jest.fn();
            mockSuccess(fromRIJKArtResponse);

            data.getAllArt({page: 1, size: 12, source: 'I do not exist' as Source}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJK}
        `('with a malformed response', async ({source}) => {
            const dispatch = jest.fn();
            mockSuccess({I: 'am wrong'});

            data.getAllArt({page: 1, size: 12, source}, dispatch);
            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJK}
        `('when the call fails', async ({source}) => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(asyncResult.of(Promise.reject(fromRIJKArtResponse)));

            data.getAllArt({page: 1, size: 12, source}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));

        });
    });

    describe('retrieving an artwork', () => {
        describe('for AIC', () => {
            describe('when it is successful', () => {
                test('for a full response', async () => {
                    const dispatch = jest.fn();
                    mockSuccess(pieceAICResponse);

                    data.getPiece({id: String(aicPiece.id), source: Source.AIC}, dispatch);

                    expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                    await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(aicPiece)));
                });
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                data.getPiece({id: String(aicPiece.id), source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardPieceResponse);

                data.getPiece({id: String(aicPiece.id), source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(harvardPiece)));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                data.getPiece({id: String(aicPiece.id), source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        describe('for RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(rijkArtObjectResponse);

                data.getPiece({id: String(aicPiece.id), source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(fromRIJKToPiece(rijkArtObjectResponse.artObject))));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                data.getPiece({id: String(aicPiece.id), source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });

        test('when the source does not exist', async () => {
            const dispatch = jest.fn();
            mockFailure(pieceAICResponse);

            data.getPiece({id: '1', source: 'I do not exist' as Source}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJK}
        `('with a malformed response', async ({source}) => {
            const dispatch = jest.fn();
            mockSuccess({I: 'am wrong'});

            data.getPiece({id: '1', source}, dispatch);
            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJK}
        `('when the call fails', async ({source}) => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(asyncResult.of(Promise.reject(fromRIJKArtResponse)));

            data.getPiece({id: String(aicPiece.id), source}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });
    });

    describe('searching for art', () => {
        const search = faker.lorem.word();

        describe('for AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(aicArtOptions);

                data.searchForArtOptions({search, source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardArtOptions);

                data.searchForArtOptions({search, source: Source.HARVARD}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
            });
        });

        describe('for RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(fromRIJKArtOptionsResponse);

                data.searchForArtOptions({search, source: Source.RIJK}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
            });
        });

        test('when the source does not exist', async () => {
            const dispatch = jest.fn();
            mockFailure(harvardArtOptions);

            data.searchForArtOptions({search, source: 'I do not exist' as Source}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJK}
        `('with a malformed response', async ({source}) => {
            const dispatch = jest.fn();
            mockSuccess({I: 'am wrong'});

            data.searchForArtOptions({search, source}, dispatch);
            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJK}
        `('when the call fails', async ({source}) => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(asyncResult.of(Promise.reject(fromRIJKArtResponse)));

            data.searchForArtOptions({search, source}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));

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


    const aicArtOptions: AICSearchResponse = {
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