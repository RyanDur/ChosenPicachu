import {data} from '../index';
import 'whatwg-fetch';
import {AICArtSuggestion, AICAutoCompleteResponse, AICPieceData, Piece, Source} from '../types';
import faker from 'faker';
import {art, artResponse} from '../../__tests__/util';
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
        test('when it is successful', async () => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(Promise.resolve(success(artResponse)));

            data.getAllArt({page: 1, source: Source.AIC}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(art)));
        });

        test('when it has a search term', async () => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(Promise.resolve(success(artResponse)));

            data.getAllArt({page: 1, search: 'rad', source: Source.HARVARD}, dispatch);
            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(art)));
        });

        test('when it is not successful', async () => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

            data.getAllArt({page: 1, source: Source.AIC}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });
    });

    describe('retrieving an artwork', () => {
        describe('for AIC', () => {
            test('when it is successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(success(pieceAICResponse)));

                data.getPiece({id: String(piece.id), source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(piece)));
            });

            test('when it is not successful', async () => {
                const dispatch = jest.fn();
                mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

                data.getPiece({id: String(piece.id), source: Source.AIC}, dispatch);

                expect(dispatch).toHaveBeenNthCalledWith(1, loading());
                await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
            });
        });
    });

    describe('searching for art', () => {
        test('when it is successful', async () => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(Promise.resolve(success(artOptions)));
            const search = faker.lorem.word();

            data.searchForArtOptions({search, source: Source.AIC}, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
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

    const piece: Piece = {
        id: pieceAICResponse.data.id,
        title: pieceAICResponse.data.title,
        image: `https://www.artic.edu/iiif/2/${pieceAICResponse.data.image_id}/full/2000,/0/default.jpg`,
        altText: pieceAICResponse.data.thumbnail?.alt_text!,
        artistInfo: pieceAICResponse.data.artist_display
    };

    const pagination = {
        total: art.pagination.total,
        limit: art.pagination.limit,
        offset: art.pagination.offset,
        total_pages: art.pagination.totalPages,
        current_page: art.pagination.currentPage,
        next_url: art.pagination.nextUrl
    };

    const options: AICArtSuggestion[] = [faker.lorem.words(), faker.lorem.words(), faker.lorem.words()];
    const artOptions: AICAutoCompleteResponse = {
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