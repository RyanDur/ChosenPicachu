import {data} from '../index';
import {mockServer, MockWebServer} from './mockServer';
import 'whatwg-fetch';
import {ArtResponse, Piece, PieceResponse} from '../types';
import faker from 'faker';
import {art} from '../../__tests__/util';
import {nanoid} from 'nanoid';
import {waitFor} from '@testing-library/react';
import {loading, onSuccess} from '../actions';

describe('data', () => {
    describe('getting the art', () => {
        let server: MockWebServer;

        beforeEach(() => {
            server = mockServer();
            server.start();
        });

        afterEach(() => server.stop());

        test('retrieving the artwork', async () => {
            const state = jest.fn();

            server.stubResponse(200, artResponse);

            data.getAllArt(1, state, server.path());

            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual('/api/v1/artworks?page=1');
                expect(state).toHaveBeenNthCalledWith(1, loading());
                expect(state).toHaveBeenNthCalledWith(2, onSuccess(art));
            });
        });

        it('should consume an artwork', async () => {
            const state = jest.fn();

            server.stubResponse(200, pieceResponse);

            data.getPiece(String(piece.id), state, server.path());

            const recordedRequest = await server.lastRequest();
            await waitFor(() => {
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks/${pieceResponse.data.id}`);
                expect(state).toHaveBeenNthCalledWith(1, loading());
                expect(state).toHaveBeenNthCalledWith(2, onSuccess(piece));
            });
        });

        const pieceResponse: PieceResponse = { data: {
                id: Math.random(),
                title: faker.lorem.words(),
                image_id: nanoid(),
                term_titles: [faker.lorem.words()],
                artist_display: faker.lorem.sentence(),
                thumbnail: {alt_text: faker.lorem.sentence()}
            }};

        const piece: Piece = {
            id: pieceResponse.data.id,
            title: pieceResponse.data.title,
            imageId: pieceResponse.data.image_id,
            altText: pieceResponse.data.thumbnail?.alt_text!,
            artistInfo: pieceResponse.data.artist_display
        };

        const artResponse: ArtResponse = {
            pagination: {
                total: art.pagination.total,
                limit: art.pagination.limit,
                offset: art.pagination.offset,
                total_pages: art.pagination.totalPages,
                current_page: art.pagination.currentPage,
                next_url: art.pagination.nextUrl
            },
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
                iiif_url: faker.internet.url(),
                website_url: art.baseUrl
            }
        };
    });
});