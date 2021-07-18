import {data} from '../index';
import {mockServer, MockWebServer} from './mockServer';
import 'whatwg-fetch';
import {Art, ArtResponse} from '../types';
import faker from 'faker';
import {art} from '../../__tests__/util';

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