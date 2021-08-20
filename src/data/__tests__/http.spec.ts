import {mockServer, MockWebServer} from './mockServer';
import {http} from '../http';
import {failure, success} from '../http/actions';
import {HTTPError, HTTPMethod} from '../http/types';

const mockDomain = jest.fn();

jest.mock('../../config', () => ({
    get domain() {
        return mockDomain();
    }
}));

describe('http calls', () => {
    let server: MockWebServer;
    beforeEach(() => {
        server = mockServer();
        server.start();
        mockDomain.mockReturnValue(server.path());
    });

    afterEach(() => server.stop());

    it('should perform a get by default', async () => {
        const newResponse = {I: 'am a response'};
        server.stubResponse(200, newResponse);

        await http({path: '/some/url'})
            .then(async (response) => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('GET');
                expect(recordedRequest.url).toEqual('/some/url');
                expect(response).toEqual(success(newResponse));
            });
    });

    it('should be able to post to an endpoint', async () => {
        const newResponse = {I: 'am a response'};
        server.stubResponse(201, newResponse);
        await http({path: '/some/url', method: HTTPMethod.POST})
            .then(async resp => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('POST');
                expect(recordedRequest.url).toEqual('/some/url');
                expect(resp).toEqual(success(newResponse));
            });
    });

    it('should be able to put to an endpoint', async () => {
        server.stubResponse(204);
        await http({path: '/some/url', method: HTTPMethod.PUT})
            .then(async resp => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('PUT');
                expect(recordedRequest.url).toEqual('/some/url');
                expect(resp).toEqual(success());
            });
    });

    it('should be able to delete to an endpoint', async () => {
        server.stubResponse(204);
        await http({path: '/some/url', method: HTTPMethod.DELETE})
            .then(async resp => {
                const recordedRequest = await server.lastRequest();
                expect(recordedRequest.method).toEqual('DELETE');
                expect(recordedRequest.url).toEqual('/some/url');
                expect(resp).toEqual(success());
            });
    });

    it('should notify when forbidden', async () => {
        server.stubResponse(403);
        await http({path: '/some/url', method: HTTPMethod.GET})
            .then(resp => expect(resp).toEqual(failure(HTTPError.FORBIDDEN)));

    });
});