import {mockServer, MockWebServer} from './mockServer';
import {HTTPError, HTTPMethod, HTTPStatus} from '../types';
import {http} from '../http';
import * as faker from 'faker';

const testObject = {foo: faker.lorem.words()};

describe('http', () => {
    let server: MockWebServer;
    let endpoint = '';
    let somePath = '';

    beforeEach(() => {
        console.error = () => {
        };
        server = mockServer();
        server.start();
        somePath = `/${faker.lorem.word()}/${faker.lorem.word()}`;
        endpoint = `${server.path()}${somePath}`;
    });

    afterEach(() => server.stop());

    describe.each`
    method         | httpMethod           | body          | code                     | response
    ${http.get}    | ${HTTPMethod.GET}    | ${undefined}  | ${HTTPStatus.OK}         | ${testObject}    
    ${http.post}   | ${HTTPMethod.POST}   | ${testObject} | ${HTTPStatus.CREATED}    | ${testObject}    
    ${http.put}    | ${HTTPMethod.PUT}    | ${testObject} | ${HTTPStatus.NO_CONTENT} | ${undefined}     
    ${http.delete} | ${HTTPMethod.DELETE} | ${undefined}  | ${HTTPStatus.NO_CONTENT} | ${undefined}    
    `('$httpMethod', ({method, httpMethod, body, code, response}) => {
        test(`${httpMethod} success`, async () => {
            server.stubResponse(code, response);

            const actual = await method({endpoint, body}).value();

            const recordedRequest = await server.lastRequest();
            expect(recordedRequest.method).toEqual(httpMethod);
            expect(recordedRequest.url).toEqual(somePath);
            expect(parse(recordedRequest.body)).toEqual(body);
            expect(await actual.orNull()).toEqual(response);
        });

        test(`${httpMethod} failure is FORBIDDEN`, async () => {
            server.stubResponse(HTTPStatus.FORBIDDEN);

            const actual = await method({endpoint, body}).value();

            // @ts-ignore
            expect(actual.explanation.reason).toEqual(HTTPError.FORBIDDEN);
        });

        test(`${httpMethod} when the network is down`, async () => {
            server.stop();

            const actual = await method({endpoint, body}).value();

            // @ts-ignore
            expect(actual.explanation.reason).toEqual(HTTPError.NETWORK_ERROR);
        });

        test(`${httpMethod} failure is SERVER_ERROR`, async () => {
            server.stubResponse(HTTPStatus.SERVER_ERROR);

            const actual = await method({endpoint, body}).value();

            // @ts-ignore
            expect(actual.explanation.reason).toEqual(HTTPError.SERVER_ERROR);
        });
    });

    test.each`
    method         | httpMethod           | body          | code                 
    ${http.get}    | ${HTTPMethod.GET}    | ${undefined}  | ${HTTPStatus.OK}         
    ${http.post}   | ${HTTPMethod.POST}   | ${testObject} | ${HTTPStatus.CREATED}
    `('$httpMethod can handle improper json', async ({method, body, code}) => {
        server.stubResponse(code, undefined);
        const actual = await method({endpoint, body}).value();
        expect(actual.explanation.reason).toEqual(HTTPError.JSON_BODY_ERROR);
    });
});

const parse = (body: any): any => {
    try {
        return JSON.parse(body);
    } catch (e) {
        return undefined;
    }
};