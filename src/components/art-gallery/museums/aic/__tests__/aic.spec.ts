import {anyRequestRespondsWith} from '@test-support/server';
import {aicArtResponse, fromAICArt, options} from '@test-support/fixtures';
import {nanoid} from 'nanoid';
import {AICPieceData, AICSearchResponse} from '@components/art-gallery/museums/aic/types';
import {art} from '@components/art-gallery/museums';
import {Art} from '@components/art-gallery/museums/art';
import {Source} from '@components/art-gallery/museums/source';
import {faker} from '@faker-js/faker';
import {env} from '@env';
import {setupAICAllArtResponse} from '@components/art-gallery/__test_support';

describe('AIC as a source of art', () => {
  const pieceAICResponse: AICPieceData = {
    data: {
      id: Math.random(),
      title: faker.lorem.words(),
      image_id: nanoid(),
      term_titles: [faker.lorem.words()],
      artist_display: faker.lorem.sentence(),
      thumbnail: {alt_text: faker.lorem.sentence()}
    }
  };

  const aicPiece: Art = {
    id: String(pieceAICResponse.data.id),
    title: pieceAICResponse.data.title,
    image: `${env.aicPictures}/${pieceAICResponse.data.image_id}/full/843,/0/default.jpg`,
    srcSet: [400, 800, 1200].map(width => `${env.aicPictures}/${pieceAICResponse.data.image_id}/full/${width},/0/default.jpg ${width}w`).join(', '),
    altText: pieceAICResponse.data.thumbnail?.alt_text || '',
    artistInfo: pieceAICResponse.data.artist_display
  };

  const aicArtOptions: AICSearchResponse = {
    pagination: {
      total: fromAICArt.pagination.total,
      limit: fromAICArt.pagination.limit,
      total_pages: fromAICArt.pagination.totalPages
    },
    data: options.map(option => ({
      suggest_autocomplete_all: [{
        input: [faker.lorem.word()],
        contexts: {
          groupings: [faker.lorem.word()]
        }
      }, {
        input: [option],
        weight: Math.floor(Math.random() * 10_000),
        contexts: {
          groupings: [faker.lorem.word()]
        }
      }]
    }))
  };

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
      anyRequestRespondsWith(JSON.stringify(pieceAICResponse));

      const actual = await art.get({id: String(aicPiece.id), source: Source.AIC}).orNull();

      expect(actual).toEqual(aicPiece);
    });

    test('an AIC piece without an image has no picture and no srcset', async () => {
      anyRequestRespondsWith(JSON.stringify({data: {...pieceAICResponse.data, image_id: null}}));

      const actual = await art.get({id: String(aicPiece.id), source: Source.AIC}).orNull();

      expect(actual).toEqual({...aicPiece, image: undefined, srcSet: undefined});
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
