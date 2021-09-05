import {mockServer, MockWebServer} from './mockServer';
import {http} from '../http';
import {HTTPError, HTTPMethod} from '../http/types';
import * as faker from 'faker';

describe('http calls', () => {
    const testResponse = {I: 'am a response'};
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
        server.stubResponse(200, testResponse);

        const actual = await http({url: someUrl}).value();

        const recordedRequest = await server.lastRequest();
        expect(recordedRequest.method).toEqual('GET');
        expect(recordedRequest.url).toEqual(somePath);
        expect(actual.orNull()?.orNull()).toEqual(testResponse);
    });

    it('should be able to post to an endpoint', async () => {
        server.stubResponse(201, testResponse);

        const actual = await http({url: someUrl, method: HTTPMethod.POST}).value();

        const recordedRequest = await server.lastRequest();
        expect(recordedRequest.method).toEqual('POST');
        expect(recordedRequest.url).toEqual(somePath);
        expect(actual.orNull()?.orNull()).toEqual(testResponse);
    });

    it('should be able to put to an endpoint', async () => {
        server.stubResponse(204);

        const actual = await http({url: someUrl, method: HTTPMethod.PUT}).value();

        const recordedRequest = await server.lastRequest();
        expect(recordedRequest.method).toEqual('PUT');
        expect(recordedRequest.url).toEqual(somePath);
        expect(actual.orNull()?.orNull()).toEqual(null);
    });

    it('should be able to delete to an endpoint', async () => {
        server.stubResponse(204);

        const actual = await http({url: someUrl, method: HTTPMethod.DELETE}).value();

        const recordedRequest = await server.lastRequest();
        expect(recordedRequest.method).toEqual('DELETE');
        expect(recordedRequest.url).toEqual(somePath);
        expect(actual.orNull()?.orNull()).toEqual(null);
    });

    it('should notify when forbidden', async () => {
        server.stubResponse(403);

        const actual = await http({url: someUrl, method: HTTPMethod.GET}).value();

        expect(actual.orNull()?.orElseErr(HTTPError.UNKNOWN)).toEqual(HTTPError.FORBIDDEN);
    });

    it('should catch thrown', async () => {
        server.stubResponse(200, () => Error());

        const actual = await http({url: someUrl, method: HTTPMethod.GET}).value();

        expect(actual.orNull()?.orElseErr(HTTPError.UNKNOWN)).toEqual(HTTPError.THROWN);
    });
});