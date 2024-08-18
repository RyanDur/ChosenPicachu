import {aicArtResponse} from '../../../__tests__/util/dummyData';
import {renderWithMemoryRouter} from '../../../__tests__/util';
import {screen, waitFor} from '@testing-library/react';
import {Paths} from '../../../routes/Paths';
import {Gallery} from '../index';
import userEvent from '@testing-library/user-event';
import {AICArtResponse} from '../resource/aic/types';

const firstPiece = aicArtResponse.data[0];

const aicArtPieceResponse: AICArtResponse = {
  data: {
    id: firstPiece.id,
    title: firstPiece.title,
    term_titles: firstPiece.term_titles,
    artist_display: firstPiece.artist_display,
    image_id: firstPiece.image_id
  }
};

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('When the art has loaded', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aicArtResponse));
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(aicArtResponse.pagination.limit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });

  it('should allow a user to take a closer look at the art', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aicArtResponse));
    fetchMock.mockResponse(JSON.stringify(aicArtPieceResponse));
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));

    expect(await screen.findByText(firstPiece.artist_display)).toBeInTheDocument();
    expect(await screen.findByTestId('image-figure')).toBeInTheDocument();
  });

  test('when there is no art to show', async () => {
    fetchMock.mockResponse(JSON.stringify({...aicArtResponse, data: []}));
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await waitFor(() => expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument());
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    fetchMock.mockReject();
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
  });
});
