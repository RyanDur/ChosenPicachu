import {screen, waitFor} from '@testing-library/react';
import {ArtPiece, useArtPiece} from '../index';
import {data} from '../../../../data';
import {renderWithRouter} from '../../../../__tests__/util';
import {Art} from '../../../../data/artGallery/types/response';
import {Explanation, explanation, HTTPError} from '../../../../data/types';
import {asyncFailure, asyncSuccess} from '@ryandur/sand';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths.ts';
import {Mock} from 'vitest';
import {Source} from '../../../../data/artGallery/types/resource.ts';

vi.mock('../index', async () => ({
  ...(await vi.importActual('../index')),
  useArtPiece: vi.fn()
}));
const success = asyncSuccess;
const failure = asyncFailure;

describe('viewing a piece', () => {
  const mockUsePieceGallery = useArtPiece as Mock;
  const mockPiece: Art = {
    id: faker.lorem.word(),
    image: faker.internet.url(),
    title: faker.lorem.words(),
    altText: faker.lorem.sentence(),
    artistInfo: faker.lorem.paragraph()
  };

  beforeEach(() => mockUsePieceGallery.mockReturnValue({
    piece: mockPiece,
    updatePiece: vi.fn(),
    reset: vi.fn()
  }));

  describe('loading the piece of art', () => {
    it('should be loading', async () => {
      data.artGallery.getArt = () => ({
        ...success(mockPiece),
        onPending: dispatch => {
          dispatch(true);
          return success(mockPiece);
        }
      });

      renderWithRouter(<ArtPiece/>, {
        initialRoute: `${Paths.artGallery}/1234`,
        path: `${Paths.artGalleryPiece}`
      });

      expect(await screen.findByTestId('loading-piece')).toBeInTheDocument();
    });
  });

  describe('when the art piece is loaded', () => {
    const params = {
      initialRoute: `${Paths.artGallery}/${mockPiece.id}`,
      path: Paths.artGalleryPiece,
      params: {tab: Source.AIC}
    };

    beforeEach(async () => {
      data.artGallery.getArt =
        vi.fn(() => success<Art, Explanation<HTTPError>>(mockPiece));
    });

    it("should display the artist's info", async () => {
      renderWithRouter(<ArtPiece/>, params);

      expect(await screen.findByText(mockPiece.artistInfo)).toBeInTheDocument();
    });

    it('should get the correct piece', async () => {
      renderWithRouter(<ArtPiece/>, params);

      await waitFor(() => expect(data.artGallery.getArt).toHaveBeenCalledWith({id: mockPiece.id, source: Source.AIC}));
    });

    it('should not have the error image', async () => {
      renderWithRouter(<ArtPiece/>, params);

      await waitFor(() => expect(screen.queryByTestId('image-error')).not.toBeInTheDocument());
    });
  });

  test('when getting the piece has errored', async () => {
    data.artGallery.getArt = () => failure(explanation(HTTPError.UNKNOWN as HTTPError));
    renderWithRouter(<ArtPiece/>, {
      initialRoute: `${Paths.artGallery}/1234`,
      path: `${Paths.artGalleryPiece}`
    });

    await waitFor(() => expect(screen.queryByTestId('image-error')).toBeInTheDocument());
    expect(screen.queryByTestId('image-figure')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-piece')).not.toBeInTheDocument();
  });
});
