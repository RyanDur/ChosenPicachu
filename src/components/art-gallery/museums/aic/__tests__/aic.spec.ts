import {anyRequestRespondsWith} from '@__test_support/server';
import {
  aicArtOptions,
  aicArtResponse,
  anAICPieceResponse,
  fromAICArt,
  fromAICPiece,
  options
} from '@components/art-gallery/__test_support/fixtures';
import {art} from '@components/art-gallery/museums';
import {Source} from '@components/art-gallery/museums/source';
import {faker} from '@faker-js/faker';
import {setupAICAllArtResponse} from '@components/art-gallery/__test_support';

describe('AIC as a source of art', () => {
  const pieceResponse = anAICPieceResponse();

  describe('a page of works', () => {
    test('turns an AIC page of works into art', async () => {
      setupAICAllArtResponse(aicArtResponse, {limit: 12, page: 1});

      const actual = await art.getAll({page: 1, size: 12, source: Source.AIC}).orNull();

      expect(actual).toEqual(fromAICArt);
    });

    test('asks AIC for the works matching a search term', async () => {
      setupAICAllArtResponse(aicArtResponse, {limit: 12, page: 1, search: 'rad'});

      const actual = await art.getAll({page: 1, size: 12, search: 'rad', source: Source.AIC}).orNull();

      expect(actual).toEqual(fromAICArt);
    });
  });

  describe('one piece', () => {
    test('turns a full AIC piece into art, picture, srcset and alt text', async () => {
      anyRequestRespondsWith(JSON.stringify(pieceResponse));

      const actual = await art.get({id: String(pieceResponse.data.id), source: Source.AIC}).orNull();

      expect(actual).toEqual(fromAICPiece(pieceResponse));
    });

    test('an AIC piece without an image has no picture and no srcset', async () => {
      const withoutImage = anAICPieceResponse({...pieceResponse.data, image_id: null});
      anyRequestRespondsWith(JSON.stringify(withoutImage));

      const actual = await art.get({id: String(withoutImage.data.id), source: Source.AIC}).orNull();

      expect(actual?.image).toBeUndefined();
      expect(actual?.srcSet).toBeUndefined();
    });
  });

  describe('suggestions', () => {
    const search = faker.lorem.word();

    test("reads the suggestions out of AIC's autocomplete", async () => {
      anyRequestRespondsWith(JSON.stringify(aicArtOptions));

      const actual = await art.search({search, source: Source.AIC}).orNull();

      expect(actual).toEqual(options);
    });
  });
});
