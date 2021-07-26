import {data} from '../index';
import {mockServer, MockWebServer} from './mockServer';
import 'whatwg-fetch';
import {Art, ArtResponse, Piece, PieceResponse} from '../types';
import faker from 'faker';
import {art} from '../../__tests__/util';
import {nanoid} from 'nanoid';

describe('data', () => {
    describe('getting the art', () => {
        let server: MockWebServer;

        beforeEach(() => {
            server = mockServer();
            server.start();
        });

        afterEach(() => server.stop());

        it('should consume all the artwork', (done) => {
            const consumer = async (data: Art) => {
                const recordedRequest = await server.lastRequest();
                expect(data).toEqual(art);
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual('/api/v1/artworks?page=1');
                done();
            };

            server.stubResponse(200, artResponse);

            data.getAllArt(consumer, 1, server.path());
        });

        it('should consume an artwork', (done) => {
            const consumer = async (data: Piece) => {
                const recordedRequest = await server.lastRequest();
                expect(data).toEqual(piece);
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(`/api/v1/artworks/${pieceResponse.data.id}`);
                done();
            };

            server.stubResponse(200, pieceResponse);
            data.getPiece(String(piece.id), consumer, server.path());
        });

        const pieceResponse: PieceResponse = { data: {
                id: Math.random(),
                title: faker.lorem.words(),
                image_id: nanoid(),
                term_titles: [faker.lorem.words()],
                thumbnail: {alt_text: faker.lorem.sentence()}
            }};

        const piece: Piece = {
            id: pieceResponse.data.id,
            title: pieceResponse.data.title,
            imageId: pieceResponse.data.image_id,
            altText: pieceResponse.data.thumbnail?.alt_text!
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