import {http as handle, HttpResponse} from 'msw';
import {HTTPError, HTTPMethod, HTTPStatus} from '../types';
import {http} from '../http';
import {faker} from '@faker-js/faker';
import {failure, Result} from '@ryandur/sand';
import {server} from '@test-support/server';

const testObject = {foo: faker.lorem.words()};

describe('http', () => {
  const endpoint = `/${faker.lorem.word()}/${faker.lorem.word()}`;

  const handlers = {
    [HTTPMethod.GET]: handle.get,
    [HTTPMethod.POST]: handle.post,
    [HTTPMethod.PUT]: handle.put,
    [HTTPMethod.DELETE]: handle.delete
  };

  const respondWith = (method: HTTPMethod, status: HTTPStatus, body: string | null = null) =>
    server.use(handlers[method](endpoint, () => new HttpResponse(body, {status})));

  const networkFailsFor = (method: HTTPMethod) =>
    server.use(handlers[method](endpoint, () => HttpResponse.error()));

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
      respondWith(httpMethod, code, response === undefined ? null : JSON.stringify(testObject));

      const actual = await method(endpoint, body).orNull();

      expect(actual).toEqual(response);
    });

    test(`${httpMethod} failure is FORBIDDEN`, async () => {
      respondWith(httpMethod, HTTPStatus.FORBIDDEN, JSON.stringify(testObject));

      const actual = (await method(endpoint, body).value).inspect();

      expect(actual).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test(`${httpMethod} when the network is down`, async () => {
      networkFailsFor(httpMethod);

      const actual = (await method(endpoint, body).value).inspect();

      expect(actual).toEqual(failure(HTTPError.NETWORK_ERROR).inspect());
    });

    test(`${httpMethod} failure is SERVER_ERROR`, async () => {
      respondWith(httpMethod, HTTPStatus.SERVER_ERROR, '');

      const actual = (await method(endpoint, body).value).inspect();

      expect(actual).toEqual(failure(HTTPError.SERVER_ERROR).inspect());
    });
  });

  test.each`
    method         | httpMethod           | body          | code
    ${http.get}    | ${HTTPMethod.GET}    | ${undefined}  | ${HTTPStatus.OK}
    ${http.post}   | ${HTTPMethod.POST}   | ${testObject} | ${HTTPStatus.CREATED}
    ${http.put}    | ${HTTPMethod.PUT}    | ${testObject} | ${HTTPStatus.CREATED}
    `('$httpMethod can handle improper json', async ({method, httpMethod, body, code}: {
    method: (endpoint: string, body?: unknown) => Result.Async<unknown, HTTPError>,
    httpMethod: HTTPMethod,
    body: unknown,
    code: HTTPStatus,
  }) => {
    respondWith(httpMethod, code, '');

    const actual = (await method(endpoint, body).value).inspect();

    expect(actual).toEqual(failure(HTTPError.JSON_BODY_ERROR).inspect());
  });
});
