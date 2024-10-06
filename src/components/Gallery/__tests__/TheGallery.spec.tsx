import {aicArtResponse, harvardArtResponse, rIJKArtResponse} from '../../../__tests__/util/dummyData';
import {renderWithMemoryRouter} from '../../../__tests__/util';
import {screen, waitFor, within} from '@testing-library/react';
import {Paths} from '../../../routes/Paths';
import {Gallery} from '../index';
import userEvent from '@testing-library/user-event';
import {AICArtResponse} from '../resource/aic/types';
import {defaultRecordLimit} from '../../../config';
import {
  setupAICAllArtResponse,
  setupAICArtPieceResponse,
  setupHarvardAllArtResponse,
  setupRijksAllArtResponse
} from './galleryApiTestHelper';

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
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    expect(await screen.findAllByTestId(/piece/)).toHaveLength(defaultRecordLimit);
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });

  describe('when looking at an individual piece', () => {
    it('should allow a user to take a closer look at the art', async () => {
      setupAICAllArtResponse(aicArtResponse);
      renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));
      // don't know why, but I need to click it twice
      await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));

      expect(await screen.findByText(firstPiece.artist_display)).toBeInTheDocument();
      expect(screen.getByTestId('image-figure')).toBeInTheDocument();
    });

    it('should update the header with the piece title', async () => {
      setupAICAllArtResponse(aicArtResponse);
      renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));
      // don't know why, but I need to click it twice
      await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));

      const header = within(screen.getByTestId('header'));
      expect(await header.findByText(firstPiece.title)).toBeInTheDocument();
    });
  });

  test('when looking at the harvard gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
    setupHarvardAllArtResponse(harvardArtResponse);

    await userEvent.click(await screen.findByText('Harvard Art Museums'));

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(defaultRecordLimit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });

  test('when looking at the rijks gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
    setupRijksAllArtResponse(rIJKArtResponse);

    await userEvent.click(await screen.findByText('Rijksstudio'));

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(defaultRecordLimit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });
});
