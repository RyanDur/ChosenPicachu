import {anyRequestRespondsWith, server} from '@test-support/server';
import {http, HttpResponse} from 'msw';
import {
  fromHarvardArt,
  harvardArtOptions,
  harvardArtResponse,
  harvardPiece,
  harvardPieceResponse,
  options
} from '@test-support/fixtures';
import {HTTPError} from '@transport/types';
import {art} from '@components/art-gallery/museums';
import {Source} from '@components/art-gallery/museums/source';
import {faker} from '@faker-js/faker';
import {env} from '@env';

describe('Harvard as a source of art', () => {
  describe('a page of works', () => {
    test('turns a Harvard page of works into art', async () => {
      anyRequestRespondsWith(JSON.stringify(harvardArtResponse));

      const actual = await art.getAll({page: 1, size: 12, source: Source.HARVARD}).orNull();

      expect(actual).toEqual(fromHarvardArt);
    });

    test("puts the search term in Harvard's query", async () => {
      const asked: URL[] = [];
      server.use(http.get(env.harvardDomain, ({request}) => {
        asked.push(new URL(request.url));
        return HttpResponse.json(harvardArtResponse);
      }));

      const actual = await art.getAll({page: 1, size: 12, search: 'rad', source: Source.HARVARD}).orNull();

      expect(actual).toEqual(fromHarvardArt);
      expect(asked[0]?.searchParams.get('q')).toContain('(rad)');
    });

    test('reports an unknown error when Harvard refuses the request', async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

      await art.getAll({page: 1, size: 12, source: Source.HARVARD})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
    });
  });

  describe('one piece', () => {
    test('turns a Harvard piece into art', async () => {
      anyRequestRespondsWith(JSON.stringify(harvardPieceResponse));

      const actual = await art.get({id: harvardPiece.id, source: Source.HARVARD}).orNull();

      expect(actual).toEqual(harvardPiece);
    });

    test('reports an unknown error when Harvard will not give the piece', async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

      await art.get({id: harvardPiece.id, source: Source.HARVARD})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
    });
  });

  describe('suggestions', () => {
    const search = faker.lorem.word();

    test("reads the suggestions out of Harvard's answer", async () => {
      anyRequestRespondsWith(JSON.stringify(harvardArtOptions));

      const actual = await art.search({search, source: Source.HARVARD}).orNull();

      expect(actual).toEqual(options);
    });

    test("reports a server error when Harvard's suggestions fail", async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);

      await art.search({search, source: Source.HARVARD}).onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.SERVER_ERROR);
    });
  });
});
