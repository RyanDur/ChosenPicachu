import {mockServer, MockWebServer} from './mockServer';
import {http} from '../http';
import {failure, success} from '../http/actions';
import {HTTPError, HTTPMethod} from '../http/types';
import * as faker from 'faker';

describe('http calls', () => {
    let server: MockWebServer;
    let someUrl = '';
    let somePath = '';
    beforeEach(() => {
        server = mockServer();
        server.start();
        somePath = `/${faker.lorem.word()}/${faker.lorem.word()}`;
        someUrl = `${server.path()}${somePath}`;
    });

    afterEach(() => server.stop());

    it('should perform a get by default', async () => {
        const newResponse = {I: 'am a response'};
        server.stubResponse(200, newResponse);

        await http({url: someUrl})
            .then(async (response) => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(somePath);
                expect(response).toEqual(success(newResponse));
            });
    });

    it('should be able to post to an endpoint', async () => {
        const newResponse = {I: 'am a response'};
        server.stubResponse(201, newResponse);
        await http({url: someUrl, method: HTTPMethod.POST})
            .then(async resp => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('POST');
                expect(recordedRequest.url).toEqual(somePath);
                expect(resp).toEqual(success(newResponse));
            });
    });

    it('should be able to put to an endpoint', async () => {
        server.stubResponse(204);
        await http({url: someUrl, method: HTTPMethod.PUT})
            .then(async resp => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('PUT');
                expect(recordedRequest.url).toEqual(somePath);
                expect(resp).toEqual(success());
            });
    });

    it('should be able to delete to an endpoint', async () => {
        server.stubResponse(204);
        await http({url: someUrl, method: HTTPMethod.DELETE})
            .then(async resp => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('DELETE');
                expect(recordedRequest.url).toEqual(somePath);
                expect(resp).toEqual(success());
            });
    });

    it('should notify when forbidden', async () => {
        server.stubResponse(403);
        await http({url: someUrl, method: HTTPMethod.GET})
            .then(resp => expect(resp).toEqual(failure(HTTPError.FORBIDDEN)));
    });
});