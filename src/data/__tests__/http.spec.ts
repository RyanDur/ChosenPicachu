import {HTTPError, HTTPMethod, HTTPStatus} from '../types';
import {http} from '../http';
import {faker} from '@faker-js/faker';
import {failure, Result} from '@ryandur/sand';

const testObject = {foo: faker.lorem.words()};

describe('http', () => {
  const endpoint = `/${faker.lorem.word()}/${faker.lorem.word()}`;

  describe.each`
    method         | httpMethod           | body          | code                     | response
    ${http.get}    | ${HTTPMethod.GET}    | ${undefined}  | ${HTTPStatus.OK}         | ${testObject}    
    ${http.post}   | ${HTTPMethod.POST}   | ${testObject} | ${HTTPStatus.CREATED}    | ${testObject}    
    ${http.put}    | ${HTTPMethod.PUT}    | ${testObject} | ${HTTPStatus.NO_CONTENT} | ${undefined}     
    ${http.put}    | ${HTTPMethod.PUT}    | ${testObject} | ${HTTPStatus.CREATED}    | ${testObject}     
    ${http.delete} | ${HTTPMethod.DELETE} | ${undefined}  | ${HTTPStatus.NO_CONTENT} | ${undefined}    
    `('$httpMethod', ({method, httpMethod, body, code, response}: {
    method: (endpoint: string, body?: unknown) => Result.Async<unknown, HTTPError>,
    httpMethod: HTTPMethod,
    body: unknown,
    code: HTTPStatus,
    response: unknown
  }) => {
    test(`${httpMethod} success`, async () => {
      fetchMock.mockResponse(JSON.stringify(testObject), {status: code});

      const actual = await method(endpoint, body).orNull();

      expect(actual).toEqual(response);
    });

    test(`${httpMethod} failure is FORBIDDEN`, async () => {
      fetchMock.mockResponse(JSON.stringify(testObject), {status: HTTPStatus.FORBIDDEN});

      const actual = (await method(endpoint, body).value).inspect();

      expect(actual).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test(`${httpMethod} when the network is down`, async () => {
      fetchMock.mockReject(new Error('Network Error'));

      const actual = (await method(endpoint, body).value).inspect();

      expect(actual).toEqual(failure(HTTPError.NETWORK_ERROR).inspect());
    });

    test(`${httpMethod} failure is SERVER_ERROR`, async () => {
      fetchMock.mockReject(new Error('Network Error'));
      fetchMock.mockResponse('', {status: HTTPStatus.SERVER_ERROR});

      const actual = (await method(endpoint, body).value).inspect();

      expect(actual).toEqual(failure(HTTPError.SERVER_ERROR).inspect());
    });
  });

  test.each`
    method         | httpMethod           | body          | code
    ${http.get}    | ${HTTPMethod.GET}    | ${undefined}  | ${HTTPStatus.OK}
    ${http.post}   | ${HTTPMethod.POST}   | ${testObject} | ${HTTPStatus.CREATED}
    ${http.put}    | ${HTTPMethod.PUT}    | ${testObject} | ${HTTPStatus.CREATED}
    `('$httpMethod can handle improper json', async ({method, body, code}: {
    method: (endpoint: string, body?: unknown) => Result.Async<unknown, HTTPError>,
    httpMethod: HTTPMethod,
    body: unknown,
    code: HTTPStatus,
  }) => {
    fetchMock.mockResponse('', {status: code});

    const actual = (await method(endpoint, body).value).inspect();

    expect(actual).toEqual(failure(HTTPError.JSON_BODY_ERROR).inspect());
  });
});
