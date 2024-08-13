import {screen, waitFor} from '@testing-library/react';
import {ArtPiece} from '../index';
import {renderWithRouter} from '../../../../__tests__/util';
import {HTTPError} from '../../../../data/types';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths';
import {Source} from '../../resource/types/resource';
import {AICArtResponse} from '../../resource/aic/types';

describe('viewing a piece', () => {
  const aicArtResponse: AICArtResponse = {
    data: {
      id: faker.number.int(),
      title: faker.lorem.words(),
      term_titles: [faker.lorem.sentence()],
      artist_display: faker.lorem.paragraph(),
      image_id: faker.lorem.word()
    }
  };

  test('when loading the piece of art', async () => {
    fetchMock.mockResponse(JSON.stringify(aicArtResponse));

    renderWithRouter(<ArtPiece/>, {
      initialRoute: `${Paths.artGallery}/1234`,
      path: `${Paths.artGalleryPiece}`
    });

    await waitFor(() => expect(screen.getByTestId('loading-piece')).toBeInTheDocument());
  });

  test('when the art piece is loaded', async () => {
    fetchMock.mockResponse(JSON.stringify(aicArtResponse));

    renderWithRouter(<ArtPiece/>, {
      initialRoute: `${Paths.artGallery}/${aicArtResponse.data.id}`,
      path: Paths.artGalleryPiece,
      params: {tab: Source.AIC}
    });

    expect(await screen.findByText(aicArtResponse.data.artist_display)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('image-error')).not.toBeInTheDocument());
  });

  test('when getting the piece has errored', async () => {
    fetchMock.mockResponse(HTTPError.SERVER_ERROR, {status: 500});
    renderWithRouter(<ArtPiece/>, {
      initialRoute: `${Paths.artGallery}/1234`,
      path: `${Paths.artGalleryPiece}`
    });

    await waitFor(() => expect(screen.queryByTestId('image-error')).toBeInTheDocument());
    expect(screen.queryByTestId('image-figure')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-piece')).not.toBeInTheDocument();
  });
});
