import {screen, waitFor} from '@testing-library/react';
import {ArtPiece} from '../index';
import {renderWithRouter} from '../../../../__tests__/util';
import {HTTPError} from '../../../../data/types';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths.ts';
import {Source} from '../../../../data/artGallery/types/resource.ts';
import {AICArtResponse} from '../../../../data/artGallery/aic/types.ts';
import {Art} from '../../../../data/artGallery/types/response.ts';

describe('viewing a piece', () => {
  const artPiece: Art = {
    id: faker.lorem.word(),
    image: faker.internet.url(),
    title: faker.lorem.words(),
    altText: faker.lorem.sentence(),
    artistInfo: faker.lorem.paragraph()
  };
  const aicArtResponse: AICArtResponse = {
    data: {
      id: faker.number.int(),
      title: faker.lorem.words(),
      term_titles: [faker.lorem.sentence()],
      artist_display: faker.lorem.paragraph()
    }
  };

  describe('loading the piece of art', () => {
    it('should be loading', async () => {
      fetchMock.mockResponse(JSON.stringify(aicArtResponse));

      renderWithRouter(<ArtPiece/>, {
        initialRoute: `${Paths.artGallery}/1234`,
        path: `${Paths.artGalleryPiece}`
      });

      await waitFor(() => expect(screen.getByTestId('loading-piece')).toBeInTheDocument());
    });
  });

  describe('when the art piece is loaded', () => {
    const params = {
      initialRoute: `${Paths.artGallery}/${artPiece.id}`,
      path: Paths.artGalleryPiece,
      pieceState: artPiece,
      params: {tab: Source.AIC}
    };

    beforeEach(async () => {
      fetchMock.mockResponse(JSON.stringify(aicArtResponse));
    });

    it("should display the artist's info", async () => {
      renderWithRouter(<ArtPiece/>, params);

      expect(await screen.findByText(artPiece.artistInfo)).toBeInTheDocument();
    });

    it('should not have the error image', async () => {
      renderWithRouter(<ArtPiece/>, params);

      await waitFor(() => expect(screen.queryByTestId('image-error')).not.toBeInTheDocument());
    });
  });

  test('when getting the piece has errored', async () => {
    fetchMock.mockResponse(HTTPError.SERVER_ERROR, {status: 400});
    renderWithRouter(<ArtPiece/>, {
      initialRoute: `${Paths.artGallery}/1234`,
      path: `${Paths.artGalleryPiece}`
    });

    await waitFor(() => expect(screen.queryByTestId('image-error')).toBeInTheDocument());
    expect(screen.queryByTestId('image-figure')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-piece')).not.toBeInTheDocument();
  });
});
