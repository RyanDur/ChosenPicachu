import {data} from '../index';
import 'whatwg-fetch';
import {ArtResponse, ArtSuggestion, AutoCompleteResponse, Piece, PieceResponse, Source} from '../types';
import faker from 'faker';
import {art} from '../../__tests__/util';
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
        test('when it is successful', async () => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(Promise.resolve(success(pieceResponse)));

            data.getPiece(String(piece.id), dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(piece)));
        });

        test('when it is not successful', async () => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(Promise.resolve(failure(HTTPError.UNKNOWN)));

            data.getPiece(String(piece.id), dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, error()));
        });
    });

    describe('searching for art', () => {
        test('when it is successful', async () => {
            const dispatch = jest.fn();
            mockHttp.mockReturnValue(Promise.resolve(success(artOptions)));
            const searchString = faker.lorem.word();

            data.searchForArtOptions(searchString, dispatch);

            expect(dispatch).toHaveBeenNthCalledWith(1, loading());
            await waitFor(() => expect(dispatch).toHaveBeenNthCalledWith(2, loaded(options)));
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