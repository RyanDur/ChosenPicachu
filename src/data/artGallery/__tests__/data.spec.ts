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
} from '../../../__tests__/util';
import {nanoid} from 'nanoid';
import {http} from '../../http';
import {asyncResult} from '@ryandur/sand';
import {AICPieceData, AICSearch} from '../aic/types';
import {HTTPError} from '../../types';
import {artGallery} from '../index';
import {Art} from '../types/response';
import {Source} from '../types/resource';

jest.mock('../../http', () => ({
    ...jest.requireActual('../../http'),
    http: {
        get: jest.fn()
    },
}));

describe('data', () => {
    const mockHttp = http as {
        get: jest.Mock
        post: any
        put: any
        delete: any
    };

    const mockSuccess = (response: any) =>
        mockHttp.get.mockReturnValue(asyncResult.success(response));
    const mockFailure = (response: any) =>
        mockHttp.get.mockReturnValue(asyncResult.failure(response));

    describe('retrieving all the artwork', () => {
        describe('when the source is AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(aicArtResponse);

                await artGallery.getAllArt({page: 1, size: 12, source: Source.AIC})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(fromAICArt);
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockSuccess(aicArtResponse);

                await artGallery.getAllArt({page: 1, size: 12, search: 'rad', source: Source.AIC})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(fromAICArt);
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                await artGallery.getAllArt({page: 1, size: 12, source: Source.AIC})
                    .onFailure(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        describe('when the source is Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardArtResponse);

                await artGallery.getAllArt({page: 1, size: 12, source: Source.HARVARD})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(fromHarvardArt);
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardArtResponse);

                await artGallery.getAllArt({page: 1, size: 12, source: Source.HARVARD})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(fromHarvardArt);
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                await artGallery.getAllArt({page: 1, size: 12, source: Source.HARVARD})
                    .onFailure(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        describe('when the source is RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(fromRIJKArtResponse);

                await artGallery.getAllArt({page: 1, size: 12, source: Source.RIJKS})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(fromRIJKArt(1, 12));
            });

            test('when it has a search term', async () => {
                const dispatch = jest.fn();
                mockSuccess(fromRIJKArtResponse);

                await artGallery.getAllArt({page: 1, size: 12, search: 'rad', source: Source.RIJKS})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(fromRIJKArt(1, 12));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                await artGallery.getAllArt({page: 1, size: 12, source: Source.RIJKS})
                    .onFailure(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        test('when the source does not exist', async () => {
            const dispatch = jest.fn();
            mockSuccess(fromRIJKArtResponse);

            await artGallery.getAllArt({page: 1, size: 12, source: 'I do not exist' as Source})
                .onFailure(dispatch).orNull();

            expect(dispatch.mock.calls[0][0].reason).toStrictEqual(HTTPError.UNKNOWN_SOURCE);
        });
    });

    describe('retrieving an artwork', () => {
        describe('for AIC', () => {
            describe('when it is successful', () => {
                test('for a full response', async () => {
                    const dispatch = jest.fn();
                    mockSuccess(pieceAICResponse);

                    await artGallery.getArt({id: String(aicPiece.id), source: Source.AIC})
                        .onSuccess(dispatch).orNull();

                    expect(dispatch).toHaveBeenCalledWith(aicPiece);
                });
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                await artGallery.getArt({id: String(aicPiece.id), source: Source.AIC})
                    .onFailure(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardPieceResponse);

                await artGallery.getArt({id: String(aicPiece.id), source: Source.HARVARD})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(harvardPiece);
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                await artGallery.getArt({id: String(aicPiece.id), source: Source.HARVARD})
                    .onFailure(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        describe('for RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(rijkArtObjectResponse);

                await artGallery.getArt({id: String(aicPiece.id), source: Source.RIJKS})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(fromRIJKToPiece(rijkArtObjectResponse.artObject));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockFailure(HTTPError.UNKNOWN);

                await artGallery.getArt({id: String(aicPiece.id), source: Source.RIJKS})
                    .onFailure(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        test('when the source does not exist', async () => {
            const dispatch = jest.fn();
            mockSuccess(pieceAICResponse);

            await artGallery.getArt({id: '1', source: 'I do not exist' as Source})
                .onFailure(dispatch).orNull();

            expect(dispatch.mock.calls[0][0].reason).toStrictEqual(HTTPError.UNKNOWN_SOURCE);
        });
    });

    describe('searching for art', () => {
        const search = faker.lorem.word();

        describe('for AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(aicArtOptions);

                await artGallery.searchForArt({search, source: Source.AIC})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(options);
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(harvardArtOptions);

                await artGallery.searchForArt({search, source: Source.HARVARD})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(options);
            });
        });

        describe('for RIJKS', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockSuccess(fromRIJKArtOptionsResponse);

                await artGallery.searchForArt({search, source: Source.RIJKS})
                    .onSuccess(dispatch).orNull();

                expect(dispatch).toHaveBeenCalledWith(options);
            });
        });

        test('when the source does not exist', async () => {
            const dispatch = jest.fn();
            mockSuccess({some: 'thing'});

            await artGallery.searchForArt({search, source: 'I do not exist' as Source})
                .onFailure(dispatch).orNull();

            expect(dispatch.mock.calls[0][0].reason).toStrictEqual(HTTPError.UNKNOWN_SOURCE);
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJKS}
        `('when the call fails', async ({source}) => {
            const dispatch = jest.fn();
            mockFailure(HTTPError.SERVER_ERROR);

            await artGallery.searchForArt({search, source}).onFailure(dispatch).orNull();

            expect(dispatch).toHaveBeenCalledWith(HTTPError.SERVER_ERROR);
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

    const aicPiece: Art = {
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


    const aicArtOptions: AICSearch = {
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