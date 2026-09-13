import {TestApp} from '@test-support/TestApp';
import {aicArtResponse, clevelandArtResponse, harvardArtResponse, vamArtResponse} from '@test-support/fixtures';
import {render, screen, waitFor, within} from '@testing-library/react';
import {has} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import userEvent from '@testing-library/user-event';
import {AICArtResponse} from '@components/art-gallery/museums/aic/types';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {
  delayAICPictures,
  delayVAMPictures,
  refuseAICPictures,
  refuseVAMPictures,
  setupAICAllArtResponse,
  setupAICArtPieceResponse,
  setupClevelandAllArtResponse,
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
    render(<TestApp at={Paths.artGallery}/>);

    expect(await screen.findAllByRole('figure')).toHaveLength(defaultRecordLimit);
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(screen.queryByAltText('empty gallery')).not.toBeInTheDocument();
  });

  describe('when looking at an individual piece', () => {
    it('should allow a user to take a closer look at the art', async () => {
      setupAICAllArtResponse(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await userEvent.click(within(await frameTitled(firstPiece.title)).getByRole('img'));

      expect(await screen.findByText(firstPiece.artist_display)).toBeInTheDocument();
      expect(screen.getByRole('figure')).toBeInTheDocument();
    });

    it('should update the header with the piece title', async () => {
      setupAICAllArtResponse(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await userEvent.click(within(await frameTitled(firstPiece.title)).getByRole('img'));

      const header = within(screen.getByRole('banner'));
      expect(await header.findByText(firstPiece.title)).toBeInTheDocument();
    });
  });

  test('when looking at the harvard gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupHarvardAllArtResponse(harvardArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await userEvent.click(await screen.findByText('Harvard Art Museums'));

    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(screen.queryByAltText('empty gallery')).not.toBeInTheDocument();
  });

  test('when looking at the vam gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupVAMAllArtResponse(vamArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await userEvent.click(await screen.findByText('The Victoria and Albert Museum'));

    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(screen.queryByAltText('empty gallery')).not.toBeInTheDocument();
  });

  test('when looking at the cleveland gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupClevelandAllArtResponse(clevelandArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await userEvent.click(await screen.findByText('The Cleveland Museum of Art'));

    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
    expect(screen.queryByAltText('empty gallery')).not.toBeInTheDocument();
  });

  test('a museum whose pictures are refused has no door, and the gallery opens elsewhere', async () => {
    setupAICAllArtResponse(aicArtResponse);
    refuseAICPictures();
    setupHarvardAllArtResponse(harvardArtResponse);

    render(<TestApp at={Paths.artGallery}/>);

    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
    expect(screen.getByRole('link', {name: 'Harvard Art Museums'})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'The Art Institute of Chicago'})).not.toBeInTheDocument();
    expect(screen.getByLabelText('url search')).toHaveTextContent('tab=harvard');
  });

  test('a door to a closed museum leads to an open one', async () => {
    setupAICAllArtResponse(aicArtResponse);
    refuseAICPictures();
    setupHarvardAllArtResponse(harvardArtResponse);

    render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);

    await waitFor(() => expect(screen.getByLabelText('url search')).toHaveTextContent('tab=harvard'));
    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
  });

  test('a door that names no museum leads to the first open one', async () => {
    setupAICAllArtResponse(aicArtResponse);

    render(<TestApp at={`${Paths.artGallery}?tab=bogus`}/>);

    await waitFor(() => expect(screen.getByLabelText('url search')).toHaveTextContent('tab=aic'));
    await waitFor(() => expect(screen.getAllByRole('figure').length).toEqual(defaultRecordLimit));
  });

  test('the first open museum is the door, however quickly the museums answer', async () => {
    setupAICAllArtResponse(aicArtResponse);
    delayAICPictures(150);

    render(<TestApp at={Paths.artGallery}/>);

    await waitFor(() => expect(screen.getByLabelText('url search')).toHaveTextContent('tab=aic'));
    expect(screen.getByRole('link', {name: 'The Art Institute of Chicago', current: 'page'})).toBeInTheDocument();
  });

  test('while the museums are asked there are no doors, only the loading sign', async () => {
    setupAICAllArtResponse(aicArtResponse);
    delayAICPictures(150);
    delayVAMPictures(150);

    render(<TestApp at={Paths.artGallery}/>);

    expect(screen.getByRole('progressbar', {name: 'loading gallery'})).toBeInTheDocument();
    expect(screen.queryByRole('navigation', {name: 'museums'})).not.toBeInTheDocument();
    expect(await screen.findByRole('navigation', {name: 'museums'})).toBeInTheDocument();
  });

  test('when no museum is open the page says so', async () => {
    refuseAICPictures();
    refuseVAMPictures();

    render(<TestApp at={Paths.artGallery}/>);

    expect(await screen.findByAltText('no museum is open')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', {name: 'museums'})).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
  });
});
