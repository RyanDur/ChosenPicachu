import {anyRequestRespondsWith} from '@__test_support/server';
import {
  clevelandArtOptions,
  clevelandArtResponse,
  clevelandPieceResponse,
  fromClevelandArt,
  fromClevelandToPiece,
  options
} from '@components/art-gallery/__test_support/fixtures';
import {setupClevelandAllArtResponse} from '@components/art-gallery/__test_support';
import {art} from '@components/art-gallery/museums';
import {Source} from '@components/art-gallery/museums/source';
import {faker} from '@faker-js/faker';

describe('Cleveland as a source of art', () => {
  describe('a page of works', () => {
    test('turns a Cleveland page of works into art', async () => {
      anyRequestRespondsWith(JSON.stringify(clevelandArtResponse));

      const actual = await art.getAll({page: 1, size: 8, source: Source.CLEVELAND}).orNull();

      expect(actual).toEqual(fromClevelandArt);
    });

    test('asks Cleveland for the works after the first page', async () => {
      setupClevelandAllArtResponse(clevelandArtResponse, {limit: 8, page: 2});

      const actual = await art.getAll({page: 2, size: 8, source: Source.CLEVELAND}).orNull();

      expect(actual).toEqual(fromClevelandArt);
    });

    test('asks Cleveland for the works matching a search term', async () => {
      setupClevelandAllArtResponse(clevelandArtResponse, {limit: 8, page: 1, search: 'rad'});

      const actual = await art.getAll({page: 1, size: 8, search: 'rad', source: Source.CLEVELAND}).orNull();

      expect(actual).toEqual(fromClevelandArt);
    });
  });

  describe('one piece', () => {
    test('turns a Cleveland piece into art', async () => {
      anyRequestRespondsWith(JSON.stringify(clevelandPieceResponse));

      const actual = await art.get({id: fromClevelandToPiece.id, source: Source.CLEVELAND}).orNull();

      expect(actual).toEqual(fromClevelandToPiece);
    });
  });

  describe('suggestions', () => {
    const search = faker.lorem.word();

    test("reads the suggestions out of Cleveland's answer", async () => {
      anyRequestRespondsWith(JSON.stringify(clevelandArtOptions));

      const actual = await art.search({search, source: Source.CLEVELAND}).orNull();

      expect(actual).toEqual(options);
    });
  });
});
