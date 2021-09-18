import {mockServer, MockWebServer} from './mockServer';
import {HTTPError} from '../types';
import {http} from '../http';
import * as faker from 'faker';

describe('http calls', () => {
    const testObject = {foo: faker.lorem.words()};
    let server: MockWebServer;
    let someUrl = '';
    let somePath = '';

    beforeEach(() => {
        console.error = () => {
        };
        server = mockServer();
        server.start();
        somePath = `/${faker.lorem.word()}/${faker.lorem.word()}`;
        someUrl = `${server.path()}${somePath}`;
    });

    afterEach(() => server.stop());

    test.each`
    method         | httpMethod  | body          | code   | response
    ${http.get}    | ${'GET'}    | ${undefined}  | ${200} | ${testObject}    
    ${http.post}   | ${'POST'}   | ${testObject} | ${201} | ${testObject}    
    ${http.put}    | ${'PUT'}    | ${testObject} | ${204} | ${undefined}    
    ${http.delete} | ${'DELETE'} | ${undefined}  | ${204} | ${undefined}    
    `('$httpMethod success', async ({method, httpMethod, body, code, response}) => {
        server.stubResponse(code, response);

        const actual = await method(someUrl, body).value();

        const recordedRequest = await server.lastRequest();
        expect(recordedRequest.method).toEqual(httpMethod);
        expect(recordedRequest.url).toEqual(somePath);
        expect(parse(recordedRequest.body)).toEqual(body);
        expect(await actual.orNull()).toEqual(response);
    });

    test.each`
    method         | httpMethod  | body          
    ${http.get}    | ${'GET'}    | ${undefined}  
    ${http.post}   | ${'POST'}   | ${testObject}
    ${http.put}    | ${'PUT'}    | ${testObject}
    ${http.delete} | ${'DELETE'} | ${undefined}  
    `('$httpMethod failure is FORBIDDEN', async ({method, body}) => {
        server.stubResponse(403);

        const actual = await method(someUrl, body).value();

        // @ts-ignore
        expect(actual.explanation).toEqual(HTTPError.FORBIDDEN);
    });

    test.each`
    method         | httpMethod  | body          
    ${http.get}    | ${'GET'}    | ${undefined}  
    ${http.post}   | ${'POST'}   | ${testObject}
    ${http.put}    | ${'PUT'}    | ${testObject}
    ${http.delete} | ${'DELETE'} | ${undefined}        
    `('$httpMethod when the network is down', async ({method, body}) => {
        server.stop();

        const actual = await method(someUrl, body).value();

        // @ts-ignore
        expect(actual.explanation).toEqual(HTTPError.NETWORK_ERROR);
    });

    test.each`
    method         | httpMethod  | body          
    ${http.get}    | ${'GET'}    | ${undefined}  
    ${http.post}   | ${'POST'}   | ${testObject}
    ${http.put}    | ${'PUT'}    | ${testObject}
    ${http.delete} | ${'DELETE'} | ${undefined}        
    `('$httpMethod failure is SERVER_ERROR', async ({method, body}) => {
        server.stubResponse(500);

        const actual = await method(someUrl, body).value();

        // @ts-ignore
        expect(actual.explanation).toEqual(HTTPError.SERVER_ERROR);
    });
});

const parse = (body: any): any => {
    try {
        return JSON.parse(body);
    } catch (e) {
        return undefined;
    }
};