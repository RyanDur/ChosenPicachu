import {anyRequestRespondsWith} from '@test-support/server';
import {
  clevelandArtOptions,
  clevelandArtResponse,
  clevelandPieceResponse,
  fromClevelandArt,
  fromClevelandToPiece,
  options
} from '@test-support/fixtures';
import {HTTPError} from '@transport/types';
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

    test('reports an unknown error when Cleveland refuses the request', async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

      await art.getAll({page: 1, size: 8, source: Source.CLEVELAND})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
    });
  });

  describe('one piece', () => {
    test('turns a Cleveland piece into art', async () => {
      anyRequestRespondsWith(JSON.stringify(clevelandPieceResponse));

      const actual = await art.get({id: fromClevelandToPiece.id, source: Source.CLEVELAND}).orNull();

      expect(actual).toEqual(fromClevelandToPiece);
    });

    test('reports an unknown error when Cleveland will not give the piece', async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

      await art.get({id: fromClevelandToPiece.id, source: Source.CLEVELAND})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
    });
  });

  describe('suggestions', () => {
    const search = faker.lorem.word();

    test("reads the suggestions out of Cleveland's answer", async () => {
      anyRequestRespondsWith(JSON.stringify(clevelandArtOptions));

      const actual = await art.search({search, source: Source.CLEVELAND}).orNull();

      expect(actual).toEqual(options);
    });

    test("reports a server error when Cleveland's suggestions fail", async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);

      await art.search({search, source: Source.CLEVELAND}).onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.SERVER_ERROR);
    });
  });
});
