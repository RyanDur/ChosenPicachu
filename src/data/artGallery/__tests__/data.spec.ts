import 'whatwg-fetch';
import {
  aicArtResponse,
  fromAICArt,
  fromHarvardArt,
  fromRIJKArt,
  fromRIJKArtOptionsResponse,
  fromRIJKArtResponse,
  fromRIJKToPiece,
  harvardArtOptions,
  harvardArtResponse,
  harvardPiece,
  harvardPieceResponse,
  options,
  rijkArtObjectResponse
} from '../../../__tests__/util/dummyData';
import {nanoid} from 'nanoid';
import {AICPieceData, AICSearch} from '../aic/types';
import {HTTPError} from '../../types';
import {artGallery} from '../index';
import {Art} from '../types/response';
import {Source} from '../types/resource';
import {faker} from '@faker-js/faker';
import {expect} from 'vitest';

describe('data', () => {
  describe('retrieving all the artwork', () => {
    describe('when the source is AIC', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(aicArtResponse));

        await artGallery.getAllArt({page: 1, size: 12, source: Source.AIC})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(fromAICArt);
      });

      test('when it has a search term', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(aicArtResponse));

        await artGallery.getAllArt({page: 1, size: 12, search: 'rad', source: Source.AIC})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(fromAICArt);
      });

      test('when it is not successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse('response', {status: 400});

        await artGallery.getAllArt({page: 1, size: 12, source: Source.AIC})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN}));
      });
    });

    describe('when the source is Harvard', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(harvardArtResponse));

        await artGallery.getAllArt({page: 1, size: 12, source: Source.HARVARD})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(fromHarvardArt);
      });

      test('when it has a search term', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(harvardArtResponse));

        await artGallery.getAllArt({page: 1, size: 12, source: Source.HARVARD})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(fromHarvardArt);
      });

      test('when it is not successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(HTTPError.UNKNOWN, {status: 400});

        await artGallery.getAllArt({page: 1, size: 12, source: Source.HARVARD})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN}));
      });
    });

    describe('when the source is RIJKS', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(fromRIJKArtResponse));

        await artGallery.getAllArt({page: 1, size: 12, source: Source.RIJKS})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(fromRIJKArt(1, 12));
      });

      test('when it has a search term', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(fromRIJKArtResponse));

        await artGallery.getAllArt({page: 1, size: 12, search: 'rad', source: Source.RIJKS})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(fromRIJKArt(1, 12));
      });

      test('when it is not successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(HTTPError.UNKNOWN, {status: 400});

        await artGallery.getAllArt({page: 1, size: 12, source: Source.RIJKS})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN}));
      });
    });

    test('when the source does not exist', async () => {
      const consumer = vi.fn();
      fetchMock.mockResponse(JSON.stringify(fromRIJKArtResponse));

      await artGallery.getAllArt({page: 1, size: 12, source: 'I do not exist' as Source})
        .onFailure(consumer).orNull();

      expect(consumer.mock.calls[0][0].reason).toStrictEqual(HTTPError.UNKNOWN_SOURCE);
    });
  });

  describe('retrieving an artwork', () => {
    describe('for AIC', () => {
      describe('when it is successful', () => {
        test('for a full response', async () => {
          const consumer = vi.fn();
          fetchMock.mockResponse(JSON.stringify(pieceAICResponse));

          await artGallery.getArt({id: String(aicPiece.id), source: Source.AIC})
            .onSuccess(consumer).orNull();

          expect(consumer).toHaveBeenCalledWith(aicPiece);
        });
      });

      test('when it is not successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse('some error', {status: 400});

        await artGallery.getArt({id: String(aicPiece.id), source: Source.AIC})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN}));
      });
    });

    describe('for Harvard', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(harvardPieceResponse));

        await artGallery.getArt({id: String(aicPiece.id), source: Source.HARVARD})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(harvardPiece);
      });

      test('when it is not successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(HTTPError.UNKNOWN, {status: 400});

        await artGallery.getArt({id: String(aicPiece.id), source: Source.HARVARD})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN}));
      });
    });

    describe('for RIJKS', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(rijkArtObjectResponse));

        await artGallery.getArt({id: String(aicPiece.id), source: Source.RIJKS})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(fromRIJKToPiece(rijkArtObjectResponse.artObject));
      });

      test('when it is not successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(HTTPError.UNKNOWN, {status: 400});

        await artGallery.getArt({id: String(aicPiece.id), source: Source.RIJKS})
          .onFailure(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN}));
      });
    });

    test('when the source does not exist', async () => {
      const consumer = vi.fn();
      fetchMock.mockResponse(JSON.stringify(pieceAICResponse));

      await artGallery.getArt({id: '1', source: 'I do not exist' as Source})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN_SOURCE}));
    });
  });

  describe('searching for art', () => {
    const search = faker.lorem.word();

    describe('for AIC', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(aicArtOptions));

        await artGallery.searchForArt({search, source: Source.AIC})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(options);
      });
    });

    describe('for Harvard', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(harvardArtOptions));

        await artGallery.searchForArt({search, source: Source.HARVARD})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(options);
      });
    });

    describe('for RIJKS', () => {
      test('when it is successful', async () => {
        const consumer = vi.fn();
        fetchMock.mockResponse(JSON.stringify(fromRIJKArtOptionsResponse));

        await artGallery.searchForArt({search, source: Source.RIJKS})
          .onSuccess(consumer).orNull();

        expect(consumer).toHaveBeenCalledWith(options);
      });
    });

    test('when the source does not exist', async () => {
      const consumer = vi.fn();
      fetchMock.mockResponse(JSON.stringify({some: 'thing'}));

      await artGallery.searchForArt({search, source: 'I do not exist' as Source})
        .onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.UNKNOWN_SOURCE}));
    });

    test.each`
        source
        ${Source.AIC}
        ${Source.HARVARD}
        ${Source.RIJKS}
        `('when the call fails', async ({source}) => {
      const consumer = vi.fn();
      fetchMock.mockResponse(HTTPError.SERVER_ERROR, {status: 500});

      await artGallery.searchForArt({search, source}).onFailure(consumer).orNull();

      expect(consumer).toHaveBeenCalledWith(expect.objectContaining({reason: HTTPError.SERVER_ERROR}));
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
    image: `https://www.artic.edu/iiif/2/${pieceAICResponse.data.image_id}/full/2000,/0/default.jpg`,
    altText: pieceAICResponse.data.thumbnail?.alt_text || '',
    artistInfo: pieceAICResponse.data.artist_display
  };

  const pagination = {
    total: fromAICArt.pagination.total,
    limit: fromAICArt.pagination.limit,
    total_pages: fromAICArt.pagination.totalPages,
    current_page: fromAICArt.pagination.currentPage
  };


  const aicArtOptions: AICSearch = {
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
