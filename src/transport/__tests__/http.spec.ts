import {http as handle, HttpResponse} from 'msw';
import {HTTPError, HTTPMethod, HTTPStatus} from '../types';
import {http} from '../http';
import {faker} from '@faker-js/faker';
import {failure, Result} from '@ryandur/sand';
import {server} from '@__test_support/server';

const testObject = {foo: faker.lorem.words()};

describe('http', () => {
  const endpoint = `/${faker.lorem.word()}/${faker.lorem.word()}`;

  test('a get can ask the cache to stand in for the network', async () => {
    let asked: string | undefined;
    server.use(handle.get(endpoint, ({request}) => {
      asked = request.cache;
      return HttpResponse.json(testObject);
    }));

    await http.get(endpoint, {cache: 'force-cache'}).value;

    expect(asked).toBe('force-cache');
  });

  test('a plain get leaves caching to the response headers', async () => {
    let asked: string | undefined;
    server.use(handle.get(endpoint, ({request}) => {
      asked = request.cache;
      return HttpResponse.json(testObject);
    }));

    await http.get(endpoint).value;

    expect(asked).toBe('default');
  });

  test('a post carries the headers it is given', async () => {
    let asked: string | null = null;
    server.use(handle.post(endpoint, ({request}) => {
      asked = request.headers.get('authorization');
      return HttpResponse.json(testObject, {status: 200});
    }));

    await http.post(endpoint, testObject, {headers: {authorization: 'bearer token'}}).value;

    expect(asked).toBe('bearer token');
  });

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

  const outcomeOf = async <T>(request: Result.Async<T, HTTPError>): Promise<string> => (await request.value).inspect();

  describe('a get', () => {
    const sent = () => http.get(endpoint);

    test('gives back the body the server answered OK with', async () => {
      respondWith(HTTPMethod.GET, HTTPStatus.OK, JSON.stringify(testObject));

      expect(await sent().orNull()).toEqual(testObject);
    });

    test('fails as forbidden when the server refuses', async () => {
      respondWith(HTTPMethod.GET, HTTPStatus.FORBIDDEN, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as forbidden when the server does not know who asked', async () => {
      respondWith(HTTPMethod.GET, HTTPStatus.UNAUTHORIZED, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as not found when the server has nothing at the address', async () => {
      respondWith(HTTPMethod.GET, HTTPStatus.NOT_FOUND, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NOT_FOUND).inspect());
    });

    test('fails as a network error when the network is down', async () => {
      networkFailsFor(HTTPMethod.GET);

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NETWORK_ERROR).inspect());
    });

    test('fails as a server error when the server breaks', async () => {
      respondWith(HTTPMethod.GET, HTTPStatus.SERVER_ERROR, '');

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.SERVER_ERROR).inspect());
    });

    test('fails as unknown when the server answers with a status it has no name for', async () => {
      server.use(handlers[HTTPMethod.GET](endpoint, () => new HttpResponse(null, {status: 400})));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.UNKNOWN).inspect());
    });

    test('fails as a bad json body when the answer is not json', async () => {
      respondWith(HTTPMethod.GET, HTTPStatus.OK, '');

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.JSON_BODY_ERROR).inspect());
    });
  });

  describe('a post', () => {
    const sent = () => http.post(endpoint, testObject);

    test('gives back the body the server answered OK with', async () => {
      respondWith(HTTPMethod.POST, HTTPStatus.OK, JSON.stringify(testObject));

      expect(await sent().orNull()).toEqual(testObject);
    });

    test('gives back the body the server answered created with', async () => {
      respondWith(HTTPMethod.POST, HTTPStatus.CREATED, JSON.stringify(testObject));

      expect(await sent().orNull()).toEqual(testObject);
    });

    test('fails as forbidden when the server refuses', async () => {
      respondWith(HTTPMethod.POST, HTTPStatus.FORBIDDEN, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as forbidden when the server does not know who asked', async () => {
      respondWith(HTTPMethod.POST, HTTPStatus.UNAUTHORIZED, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as not found when the server has nothing at the address', async () => {
      respondWith(HTTPMethod.POST, HTTPStatus.NOT_FOUND, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NOT_FOUND).inspect());
    });

    test('fails as a network error when the network is down', async () => {
      networkFailsFor(HTTPMethod.POST);

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NETWORK_ERROR).inspect());
    });

    test('fails as a server error when the server breaks', async () => {
      respondWith(HTTPMethod.POST, HTTPStatus.SERVER_ERROR, '');

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.SERVER_ERROR).inspect());
    });

    test('fails as unknown when the server answers with a status it has no name for', async () => {
      server.use(handlers[HTTPMethod.POST](endpoint, () => new HttpResponse(null, {status: 400})));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.UNKNOWN).inspect());
    });

    test('fails as a bad json body when the answer is not json', async () => {
      respondWith(HTTPMethod.POST, HTTPStatus.CREATED, '');

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.JSON_BODY_ERROR).inspect());
    });
  });

  describe('a put', () => {
    const sent = () => http.put(endpoint, testObject);

    test('gives back nothing when the server answers with no content', async () => {
      respondWith(HTTPMethod.PUT, HTTPStatus.NO_CONTENT, null);

      expect(await sent().orNull()).toEqual(undefined);
    });

    test('gives back the body the server answered created with', async () => {
      respondWith(HTTPMethod.PUT, HTTPStatus.CREATED, JSON.stringify(testObject));

      expect(await sent().orNull()).toEqual(testObject);
    });

    test('fails as forbidden when the server refuses', async () => {
      respondWith(HTTPMethod.PUT, HTTPStatus.FORBIDDEN, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as forbidden when the server does not know who asked', async () => {
      respondWith(HTTPMethod.PUT, HTTPStatus.UNAUTHORIZED, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as not found when the server has nothing at the address', async () => {
      respondWith(HTTPMethod.PUT, HTTPStatus.NOT_FOUND, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NOT_FOUND).inspect());
    });

    test('fails as a network error when the network is down', async () => {
      networkFailsFor(HTTPMethod.PUT);

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NETWORK_ERROR).inspect());
    });

    test('fails as a server error when the server breaks', async () => {
      respondWith(HTTPMethod.PUT, HTTPStatus.SERVER_ERROR, '');

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.SERVER_ERROR).inspect());
    });

    test('fails as unknown when the server answers with a status it has no name for', async () => {
      server.use(handlers[HTTPMethod.PUT](endpoint, () => new HttpResponse(null, {status: 400})));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.UNKNOWN).inspect());
    });

    test('fails as a bad json body when the answer is not json', async () => {
      respondWith(HTTPMethod.PUT, HTTPStatus.CREATED, '');

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.JSON_BODY_ERROR).inspect());
    });
  });

  describe('a delete', () => {
    const sent = () => http.delete(endpoint);

    test('gives back nothing when the server answers with no content', async () => {
      respondWith(HTTPMethod.DELETE, HTTPStatus.NO_CONTENT, null);

      expect(await sent().orNull()).toEqual(undefined);
    });

    test('fails as forbidden when the server refuses', async () => {
      respondWith(HTTPMethod.DELETE, HTTPStatus.FORBIDDEN, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as forbidden when the server does not know who asked', async () => {
      respondWith(HTTPMethod.DELETE, HTTPStatus.UNAUTHORIZED, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.FORBIDDEN).inspect());
    });

    test('fails as not found when the server has nothing at the address', async () => {
      respondWith(HTTPMethod.DELETE, HTTPStatus.NOT_FOUND, JSON.stringify(testObject));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NOT_FOUND).inspect());
    });

    test('fails as a network error when the network is down', async () => {
      networkFailsFor(HTTPMethod.DELETE);

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.NETWORK_ERROR).inspect());
    });

    test('fails as a server error when the server breaks', async () => {
      respondWith(HTTPMethod.DELETE, HTTPStatus.SERVER_ERROR, '');

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.SERVER_ERROR).inspect());
    });

    test('fails as unknown when the server answers with a status it has no name for', async () => {
      server.use(handlers[HTTPMethod.DELETE](endpoint, () => new HttpResponse(null, {status: 400})));

      expect(await outcomeOf(sent())).toEqual(failure(HTTPError.UNKNOWN).inspect());
    });
  });
});
