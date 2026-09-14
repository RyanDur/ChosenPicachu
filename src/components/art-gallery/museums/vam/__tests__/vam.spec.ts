import {anyRequestRespondsWith} from '@test-support/server';
import {
  fromVAMArt,
  fromVAMToPiece,
  options,
  vamArtOptions,
  vamArtResponse,
  vamPieceResponse
} from '@test-support/fixtures';
import {HTTPError} from '@transport/types';
import {art} from '@components/art-gallery/museums';
import {Source} from '@components/art-gallery/museums/source';
import {faker} from '@faker-js/faker';

describe('VAM as a source of art', () => {
  describe('a page of works', () => {
    test('turns a VAM page of works into art', async () => {
      anyRequestRespondsWith(JSON.stringify(vamArtResponse));

      const actual = await art.getAll({page: 1, size: 8, source: Source.VAM}).orNull();

      expect(actual).toEqual(fromVAMArt);
    });

    test('reports an unknown error when VAM refuses the request', async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

      await art.getAll({page: 1, size: 8, source: Source.VAM})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
    });
  });

  describe('one piece', () => {
    test('turns a VAM piece into art', async () => {
      anyRequestRespondsWith(JSON.stringify(vamPieceResponse));

      const actual = await art.get({id: fromVAMToPiece.id, source: Source.VAM}).orNull();

      expect(actual).toEqual(fromVAMToPiece);
    });

    test('reports an unknown error when VAM will not give the piece', async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

      await art.get({id: fromVAMToPiece.id, source: Source.VAM})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
    });
  });

  describe('suggestions', () => {
    const search = faker.lorem.word();

    test("reads the suggestions out of VAM's answer", async () => {
      anyRequestRespondsWith(JSON.stringify(vamArtOptions));

      const actual = await art.search({search, source: Source.VAM}).orNull();

      expect(actual).toEqual(options);
    });

    test("reports a server error when VAM's suggestions fail", async () => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);

      await art.search({search, source: Source.VAM}).onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.SERVER_ERROR);
    });
  });
});
