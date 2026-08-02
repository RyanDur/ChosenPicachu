import {aicArtResponse, harvardArtResponse, vamArtResponse} from '@test-support/fixtures';
import {renderWithMemoryRouter} from '@test-support';
import {screen, waitFor, within} from '@testing-library/react';
import {has} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import {Gallery} from '@pages/Gallery';
import userEvent from '@testing-library/user-event';
import {AICArtResponse} from '@components/art-gallery/museums/aic/types';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {
  setupAICAllArtResponse,
  setupAICArtPieceResponse,
  setupHarvardAllArtResponse,
  setupVAMAllArtResponse
} from '@components/art-gallery/__tests__/galleryApiTestHelper';

const firstPiece = aicArtResponse.data[0];

const frameTitled = async (title: string): Promise<HTMLElement> => {
  const frames = await screen.findAllByRole('figure');
  const frame = frames.find(figure => has(within(figure).queryByText(title)));
  if (has(frame)) return frame;
  throw new Error(`no frame titled ${title}`);
};

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

    expect(await screen.findAllByRole('figure')).toHaveLength(defaultRecordLimit);
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(screen.queryByAltText('empty gallery')).not.toBeInTheDocument();
  });

  describe('when looking at an individual piece', () => {
    it('should allow a user to take a closer look at the art', async () => {
      setupAICAllArtResponse(aicArtResponse);
      renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await userEvent.click(within(await frameTitled(firstPiece.title)).getByRole('img'));

      expect(await screen.findByText(firstPiece.artist_display)).toBeInTheDocument();
      expect(screen.getByRole('figure')).toBeInTheDocument();
    });

    it('should update the header with the piece title', async () => {
      setupAICAllArtResponse(aicArtResponse);
      renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await userEvent.click(within(await frameTitled(firstPiece.title)).getByRole('img'));

      const header = within(screen.getByRole('banner'));
      expect(await header.findByText(firstPiece.title)).toBeInTheDocument();
    });
  });

  test('when looking at the harvard gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
    setupHarvardAllArtResponse(harvardArtResponse);

    await userEvent.click(await screen.findByText('Harvard Art Museums'));

    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(screen.queryByAltText('empty gallery')).not.toBeInTheDocument();
  });

  test('when looking at the vam gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});
    setupVAMAllArtResponse(vamArtResponse);

    await userEvent.click(await screen.findByText('The Victoria and Albert Museum'));

    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(screen.queryByAltText('empty gallery')).not.toBeInTheDocument();
  });
});
