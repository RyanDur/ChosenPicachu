import {anyRequestRespondsWith, server} from '@test-support/server';
import {http, HttpResponse} from 'msw';
import {
  aicArtResponse,
  clevelandArtOptions,
  clevelandArtResponse,
  clevelandPieceResponse,
  fromClevelandArt,
  fromClevelandToPiece,
  fromAICArt,
  fromHarvardArt,
  harvardArtOptions,
  harvardArtResponse,
  harvardPiece,
  harvardPieceResponse,
  options,
  fromVAMArt,
  fromVAMToPiece,
  vamArtOptions,
  vamArtResponse,
  vamPieceResponse
} from '@test-support/fixtures';
import {nanoid} from 'nanoid';
import {AICPieceData, AICSearchResponse} from '@components/art-gallery/museums/aic/types';
import {HTTPError} from '@transport/types';
import {art} from '@components/art-gallery/museums';
import {Art} from '@components/art-gallery/museums/art';
import {Source} from '@components/art-gallery/museums/source';
import {faker} from '@faker-js/faker';
import {env} from '@env';
import {expect} from 'vitest';
import {setupAICAllArtResponse} from '@components/art-gallery/__test_support';

describe('data', () => {
  describe('retrieving all the artwork', () => {
    describe('when the source is AIC', () => {
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

      test('reports an unknown error when AIC refuses the request', async () => {
        const consumer = vi.fn();
        anyRequestRespondsWith('response', 400);

        await art.getAll({page: 1, size: 12, source: Source.AIC})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
      });
    });

    describe('when the source is Harvard', () => {
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

    describe('when the source is VAM', () => {
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

    describe('when the source is Cleveland', () => {
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
  });

  describe('retrieving a Cleveland artwork', () => {
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

  describe('retrieving an artwork', () => {
    describe('for AIC', () => {
      describe('when it is successful', () => {
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

      test('reports an unknown error when AIC will not give the piece', async () => {
        const consumer = vi.fn();
        anyRequestRespondsWith('some error', 400);

        await art.get({id: String(aicPiece.id), source: Source.AIC})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
      });
    });

    describe('for Harvard', () => {
      test('turns a Harvard piece into art', async () => {
        anyRequestRespondsWith(JSON.stringify(harvardPieceResponse));

        const actual = await art.get({id: String(aicPiece.id), source: Source.HARVARD})
          .orNull();

        expect(actual).toEqual(harvardPiece);
      });

      test('reports an unknown error when Harvard will not give the piece', async () => {
        const consumer = vi.fn();
        anyRequestRespondsWith(HTTPError.UNKNOWN, 400);

        await art.get({id: String(aicPiece.id), source: Source.HARVARD})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(HTTPError.UNKNOWN);
      });
    });

  });

  describe('retrieving a VAM artwork', () => {
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

  describe('searching for art', () => {
    const search = faker.lorem.word();

    describe('for AIC', () => {
      test("reads the suggestions out of AIC's autocomplete", async () => {
        anyRequestRespondsWith(JSON.stringify(aicArtOptions));

        const actual = await art.search({search, source: Source.AIC}).orNull();

        expect(actual).toEqual(options);
      });
    });

    describe('for Harvard', () => {
      test("reads the suggestions out of Harvard's answer", async () => {
        anyRequestRespondsWith(JSON.stringify(harvardArtOptions));

        const actual = await art.search({search, source: Source.HARVARD}).orNull();

        expect(actual).toEqual(options);
      });
    });

    describe('for VAM', () => {
      test("reads the suggestions out of VAM's answer", async () => {
        anyRequestRespondsWith(JSON.stringify(vamArtOptions));

        const actual = await art.search({search, source: Source.VAM}).orNull();

        expect(actual).toEqual(options);
      });
    });

    describe('for Cleveland', () => {
      test("reads the suggestions out of Cleveland's answer", async () => {
        anyRequestRespondsWith(JSON.stringify(clevelandArtOptions));

        const actual = await art.search({search, source: Source.CLEVELAND}).orNull();

        expect(actual).toEqual(options);
      });
    });

    test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.VAM}
        ${Source.CLEVELAND}
        `("reports a server error when any museum's suggestions fail", async ({source}) => {
      const consumer = vi.fn();
      anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);

      await art.search({search, source}).onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(HTTPError.SERVER_ERROR);
    });
  });

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

  const pagination = {
    total: fromAICArt.pagination.total,
    limit: fromAICArt.pagination.limit,
    total_pages: fromAICArt.pagination.totalPages,
    current_page: 1
  };

  const aicArtOptions: AICSearchResponse = {
    pagination,
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
});
