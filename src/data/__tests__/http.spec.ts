import {mockServer, MockWebServer} from './mockServer';
import {http} from '../http';
import {failure, success} from '../http/actions';
import {HTTPError, HTTPMethod} from '../http/types';
import * as faker from 'faker';
import * as D from 'schemawax';

describe('http calls', () => {
    const testDecoder = D.object({
        required: {
            I: D.string
        }
    });
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
        const newResponse = {I: 'am a response'};
        server.stubResponse(200, newResponse);

        await http({url: someUrl, decoder: testDecoder})
            .then(async (response) => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual(somePath);
                expect(response).toEqual(success(newResponse));
            });
    });

    it('should be able to post to an endpoint', async () => {
        server.stubResponse(201, testResponse);
        await http({url: someUrl, decoder: testDecoder, method: HTTPMethod.POST})
            .then(async resp => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('POST');
                expect(recordedRequest.url).toEqual(somePath);
                expect(resp).toEqual(success(testResponse));
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

    it('should fail if shape of response is wrong', async () => {
        const testFailDecoder = D.object({
            required: {
                I: D.number
            }
        });

        server.stubResponse(200, testResponse);

        await http({url: someUrl, decoder: testFailDecoder})
            .then(response => expect(response).toEqual(failure(HTTPError.MALFORMED_RESPONSE)));
    });

    it('should notify when forbidden', async () => {
        server.stubResponse(403);
        await http({url: someUrl, method: HTTPMethod.GET})
            .then(resp => expect(resp).toEqual(failure(HTTPError.FORBIDDEN)));
    });

    it('should catch thrown', async () => {
        server.stubResponse(200, undefined);
        await http({url: someUrl, method: HTTPMethod.GET})
            .then(resp => expect(resp).toEqual(failure(HTTPError.THROWN)));
    });
});