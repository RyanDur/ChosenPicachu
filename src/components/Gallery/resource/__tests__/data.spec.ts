import {anyRequestRespondsWith} from '../../../../__tests__/util/server';
import {
    aicArtResponse,
    fromAICArt,
    fromHarvardArt,
    harvardArtOptions,
    harvardArtResponse,
    harvardPiece,
    harvardPieceResponse,
    options,
    fromVAMArt,
    fromVAMToPiece,
    vamArtOptions,
    vamArtResponse,
    vamPieceResponse
} from '../../../../dummyData';
import {nanoid} from 'nanoid';
import {AICPieceData, AICSearchResponse} from '../aic/types';
import {HTTPError} from '@transport/types';
import {art} from '../index';
import {Art} from '../types/response';
import {Source} from '../types/resource';
import {faker} from '@faker-js/faker';
import {expect} from 'vitest';
import {setupAICAllArtResponse} from '../../__tests__/galleryApiTestHelper';

describe('data', () => {
    describe('retrieving all the artwork', () => {
        describe('when the source is AIC', () => {
            test('when it is successful', async () => {
                setupAICAllArtResponse(aicArtResponse, {limit: 12, page: 1});

                const actual = await art.getAll({page: 1, size: 12, source: Source.AIC}).orNull();

                expect(actual).toEqual(fromAICArt);
            });

            test('when it has a search term', async () => {
                setupAICAllArtResponse(aicArtResponse, {limit: 12, page: 1, search: 'rad'});

                const actual = await art.getAll({page: 1, size: 12, search: 'rad', source: Source.AIC}).orNull();

                expect(actual).toEqual(fromAICArt);
            });

            test('when it is not successful', async () => {
                const consumer = vi.fn();
                anyRequestRespondsWith('response', 400);

                await art.getAll({page: 1, size: 12, source: Source.AIC})
                    .onFailure(consumer).orNull();

                expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        describe('when the source is Harvard', () => {
            test('when it is successful', async () => {
                anyRequestRespondsWith(JSON.stringify(harvardArtResponse));

                const actual = await art.getAll({page: 1, size: 12, source: Source.HARVARD}).orNull();

                expect(actual).toEqual(fromHarvardArt);
            });

            test('when it has a search term', async () => {
                anyRequestRespondsWith(JSON.stringify(harvardArtResponse));

                const actual = await art.getAll({page: 1, size: 12, source: Source.HARVARD}).orNull();

                expect(actual).toEqual(fromHarvardArt);
            });

            test('when it is not successful', async () => {
                const consumer = vi.fn();
                anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

                await art.getAll({page: 1, size: 12, source: Source.HARVARD})
                    .onFailure(consumer).orNull();

                expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        test('when the source does not exist', async () => {
            const consumer = vi.fn();
            anyRequestRespondsWith(JSON.stringify(vamArtResponse));

            await art.getAll({page: 1, size: 12, source: 'I do not exist' as Source})
                .onFailure(consumer).orNull();

            expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN_SOURCE);
        });
    });

        describe('when the source is VAM', () => {
            test('when it is successful', async () => {
                anyRequestRespondsWith(JSON.stringify(vamArtResponse));

                const actual = await art.getAll({page: 1, size: 8, source: Source.VAM}).orNull();

                expect(actual).toEqual(fromVAMArt);
            });

            test('when it is not successful', async () => {
                const consumer = vi.fn();
                anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

                await art.getAll({page: 1, size: 8, source: Source.VAM})
                    .onFailure(consumer).orNull();

                expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

    describe('retrieving an artwork', () => {
        describe('for AIC', () => {
            describe('when it is successful', () => {
                test('for a full response', async () => {
                    anyRequestRespondsWith(JSON.stringify(pieceAICResponse));

                    const actual = await art.get({id: String(aicPiece.id), source: Source.AIC}).orNull();

                    expect(actual).toEqual(aicPiece);
                });
            });

            test('when it is not successful', async () => {
                const consumer = vi.fn();
                anyRequestRespondsWith('some error', 400);

                await art.get({id: String(aicPiece.id), source: Source.AIC})
                    .onFailure(consumer).orNull();

                expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                const consumer = vi.fn();
                anyRequestRespondsWith(JSON.stringify(harvardPieceResponse));

                const actual = await art.get({id: String(aicPiece.id), source: Source.HARVARD})
                    .onSuccess(consumer).orNull();

                expect(actual).toEqual(harvardPiece);
            });

            test('when it is not successful', async () => {
                const consumer = vi.fn();
                anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

                await art.get({id: String(aicPiece.id), source: Source.HARVARD})
                    .onFailure(consumer).orNull();

                expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
            });
        });

        test('when the source does not exist', async () => {
            const consumer = vi.fn();
            anyRequestRespondsWith(JSON.stringify(pieceAICResponse));

            await art.get({id: '1', source: 'I do not exist' as Source})
                .onFailure(consumer).orNull();

            expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN_SOURCE);
        });
    });

    describe('retrieving a VAM artwork', () => {
        test('when it is successful', async () => {
            anyRequestRespondsWith(JSON.stringify(vamPieceResponse));

            const actual = await art.get({id: fromVAMToPiece.id, source: Source.VAM}).orNull();

            expect(actual).toEqual(fromVAMToPiece);
        });

        test('when it is not successful', async () => {
            const consumer = vi.fn();
            anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

            await art.get({id: fromVAMToPiece.id, source: Source.VAM})
                .onFailure(consumer).orNull();

            expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
        });
    });

    describe('searching for art', () => {
        const search = faker.lorem.word();

        describe('for AIC', () => {
            test('when it is successful', async () => {
                anyRequestRespondsWith(JSON.stringify(aicArtOptions));

                const actual = await art.search({search, source: Source.AIC}).orNull();

                expect(actual).toEqual(options);
            });
        });

        describe('for Harvard', () => {
            test('when it is successful', async () => {
                anyRequestRespondsWith(JSON.stringify(harvardArtOptions));

                const actual = await art.search({search, source: Source.HARVARD}).orNull();

                expect(actual).toEqual(options);
            });
        });

        describe('for VAM', () => {
            test('when it is successful', async () => {
                anyRequestRespondsWith(JSON.stringify(vamArtOptions));

                const actual = await art.search({search, source: Source.VAM}).orNull();

                expect(actual).toEqual(options);
            });
        });

        test('when the source does not exist', async () => {
            const consumer = vi.fn();
            anyRequestRespondsWith(JSON.stringify({some: 'thing'}));

            await art.search({search, source: 'I do not exist' as Source})
                .onFailure(consumer).orNull();

            expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN_SOURCE);
        });

        test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.VAM}
        `('when the call fails', async ({source}) => {
            const consumer = vi.fn();
            anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);

            await art.search({search, source}).onFailure(consumer).orNull();

            expect(consumer).toHaveBeenCalledWith(HTTPError.SERVER_ERROR);
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
        altText: pieceAICResponse.data.thumbnail?.alt_text || '',
        artistInfo: pieceAICResponse.data.artist_display
    };

    const pagination = {
        total: fromAICArt.pagination.total,
        limit: fromAICArt.pagination.limit,
        total_pages: fromAICArt.pagination.totalPages,
        current_page: fromAICArt.pagination.currentPage
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
