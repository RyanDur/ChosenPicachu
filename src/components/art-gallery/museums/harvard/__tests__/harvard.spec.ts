import {anyRequestRespondsWith, server} from '@__test_support/server';
import {http, HttpResponse} from 'msw';
import {
  fromHarvardArt,
  harvardArtOptions,
  harvardArtResponse,
  harvardPiece,
  harvardPieceResponse,
  options
} from '@__test_support/fixtures';
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
  });

  describe('one piece', () => {
    test('turns a Harvard piece into art', async () => {
      anyRequestRespondsWith(JSON.stringify(harvardPieceResponse));

      const actual = await art.get({id: harvardPiece.id, source: Source.HARVARD}).orNull();

      expect(actual).toEqual(harvardPiece);
    });
  });

  describe('suggestions', () => {
    const search = faker.lorem.word();

    test("reads the suggestions out of Harvard's answer", async () => {
      anyRequestRespondsWith(JSON.stringify(harvardArtOptions));

      const actual = await art.search({search, source: Source.HARVARD}).orNull();

      expect(actual).toEqual(options);
    });
  });
});
