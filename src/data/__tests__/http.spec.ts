import {mockServer, MockWebServer} from './mockServer';
import {waitFor} from '@testing-library/react';
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
        const consumer = jest.fn();
        const newResponse = {I: 'am a response'};
        server.stubResponse(200, newResponse);

        http({path: '/some/url'}, consumer);

        const recordedRequest = await server.lastRequest();
        await waitFor(() => {
            expect(recordedRequest.method).toEqual('GET');
            expect(recordedRequest.url).toEqual('/some/url');
            expect(consumer).toHaveBeenCalledWith(success(newResponse));
        });
    });

    it('should be able to post to an endpoint', async () => {
        const consumer = jest.fn();
        const newResponse = {I: 'am a response'};
        server.stubResponse(201, newResponse);
        http({path: '/some/url', method: HTTPMethod.POST}, consumer);

        const recordedRequest = await server.lastRequest();
        await waitFor(() => {
            expect(recordedRequest.method).toEqual('POST');
            expect(recordedRequest.url).toEqual('/some/url');
            expect(consumer).toHaveBeenCalledWith(success(newResponse));
        });
    });

    it('should be able to put to an endpoint', async () => {
        const consumer = jest.fn();
        server.stubResponse(204);
        http({path: '/some/url', method: HTTPMethod.PUT}, consumer);

        const recordedRequest = await server.lastRequest();
        await waitFor(() => {
            expect(recordedRequest.method).toEqual('PUT');
            expect(recordedRequest.url).toEqual('/some/url');
            expect(consumer).toHaveBeenCalledWith(success());
        });
    });

    it('should be able to delete to an endpoint', async () => {
        const consumer = jest.fn();
        server.stubResponse(204);
        http({path: '/some/url', method: HTTPMethod.DELETE}, consumer);

        const recordedRequest = await server.lastRequest();
        await waitFor(() => {
            expect(recordedRequest.method).toEqual('DELETE');
            expect(recordedRequest.url).toEqual('/some/url');
            expect(consumer).toHaveBeenCalledWith(success());
        });
    });

    it('should notify when forbidden', async () => {
        const consumer = jest.fn();
        server.stubResponse(403);
        http({path: '/some/url', method: HTTPMethod.GET}, consumer);

        await waitFor(() => {
            expect(consumer).toHaveBeenCalledWith(failure(HTTPError.FORBIDDEN));
        });
    });
});