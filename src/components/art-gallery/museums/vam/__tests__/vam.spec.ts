import {anyRequestRespondsWith} from '@__test_support/server';
import {
  fromVAMArt,
  fromVAMToPiece,
  options,
  vamArtOptions,
  vamArtResponse,
  vamPieceResponse
} from '@components/art-gallery/__test_support/fixtures';
import {setupVAMAllArtResponse} from '@components/art-gallery/__test_support';
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

    test('asks VAM for the works matching a search term', async () => {
      setupVAMAllArtResponse(vamArtResponse, {limit: 8, page: 1, search: 'rad'});

      const actual = await art.getAll({page: 1, size: 8, search: 'rad', source: Source.VAM}).orNull();

      expect(actual).toEqual(fromVAMArt);
    });
  });

  describe('one piece', () => {
    test('turns a VAM piece into art', async () => {
      anyRequestRespondsWith(JSON.stringify(vamPieceResponse));

      const actual = await art.get({id: fromVAMToPiece.id, source: Source.VAM}).orNull();

      expect(actual).toEqual(fromVAMToPiece);
    });
  });

  describe('suggestions', () => {
    const search = faker.lorem.word();

    test("reads the suggestions out of VAM's answer", async () => {
      anyRequestRespondsWith(JSON.stringify(vamArtOptions));

      const actual = await art.search({search, source: Source.VAM}).orNull();

      expect(actual).toEqual(options);
    });
  });
});
