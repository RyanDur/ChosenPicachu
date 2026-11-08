import {TestApp} from '@__test_support/TestApp';
import {
  aicArtResponse,
  anAICPieceResponse,
  clevelandArtResponse,
  harvardArtResponse,
  vamArtResponse
} from '@pages/Gallery/__test_support/fixtures';
import {render, waitFor} from '@testing-library/react';
import {Paths} from '@pages/Paths';
import {limits} from '@pages/Gallery/limits';
import {galleryPage} from '../__test_support/gallery';
import {piecePage} from '@pages/Gallery/ArtPiece/__test_support';
import {
  heldAICAllArtResponse,
  heldAICArtPieceResponse,
  heldAICPictures,
  heldVAMAllArtResponse,
  heldVAMPictures,
  harvardNeverAnswers,
  refuseAICPictures,
  refuseVAMPictures,
  setupAICAllArtResponse,
  setupAICArtPieceResponse,
  setupClevelandAllArtResponse,
  setupHarvardAllArtResponse,
  setupVAMAllArtResponse,
  galleryWall
} from '@pages/Gallery/__test_support';

const firstPiece = aicArtResponse.data[0];
const secondPiece = aicArtResponse.data[1];

const aicArtPieceResponse = anAICPieceResponse(firstPiece);

describe('The gallery.', () => {
  test('the wall hangs a full page of works once the art has loaded', async () => {
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(await galleryWall.framesAppear()).toHaveLength(limits.record);
    expect(galleryWall.loadingSign()).not.toBeInTheDocument();
    expect(galleryPage.emptyWallIfAny()).not.toBeInTheDocument();
  });

  describe('when looking at an individual piece', () => {
    it('should allow a user to take a closer look at the art', async () => {
      setupAICAllArtResponse(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await galleryWall.openPiece(firstPiece.title);

      expect(await piecePage.artistAppears(firstPiece.artist_display)).toBeInTheDocument();
      expect(piecePage.easel()).toBeInTheDocument();
    });

    it('should update the header with the piece title', async () => {
      setupAICAllArtResponse(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);

      await galleryWall.openPiece(firstPiece.title);

      expect(await galleryPage.headerShows(firstPiece.title)).toBeInTheDocument();
    });

    it('opening a second piece leaves nothing of the first on the easel', async () => {
      setupAICAllArtResponse(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      setupAICArtPieceResponse(aicArtPieceResponse, firstPiece.id);
      await galleryWall.openPiece(firstPiece.title);
      await galleryPage.headerShows(firstPiece.title);
      const secondArrives = heldAICArtPieceResponse(anAICPieceResponse(secondPiece), secondPiece.id);

      await galleryPage.backToTheWall();
      await galleryWall.openPiece(secondPiece.title);

      expect(await piecePage.loadingAppears()).toBeInTheDocument();
      expect(piecePage.title()).toHaveTextContent('A piece');
      expect(piecePage.easelIfAny()).not.toBeInTheDocument();

      secondArrives();
      expect(await galleryPage.headerShows(secondPiece.title)).toBeInTheDocument();
    });
  });

  test("choosing Harvard hangs Harvard's works on the wall", async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupHarvardAllArtResponse(harvardArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await galleryPage.enter('Harvard Art Museums');

    await waitFor(() => expect(galleryWall.frames()).toHaveLength(limits.record));
    expect(galleryWall.loadingSign()).not.toBeInTheDocument();
    expect(galleryPage.emptyWallIfAny()).not.toBeInTheDocument();
  });

  test('choosing the Victoria and Albert hangs its works on the wall', async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupVAMAllArtResponse(vamArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await galleryPage.enter('The Victoria and Albert Museum');

    await waitFor(() => expect(galleryWall.frames()).toHaveLength(limits.record));
    expect(galleryWall.loadingSign()).not.toBeInTheDocument();
    expect(galleryPage.emptyWallIfAny()).not.toBeInTheDocument();
  });

  test("choosing Cleveland hangs Cleveland's works on the wall", async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupClevelandAllArtResponse(clevelandArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await galleryPage.enter('The Cleveland Museum of Art');

    await waitFor(() => expect(galleryWall.frames()).toHaveLength(limits.record));
    expect(galleryPage.emptyWallIfAny()).not.toBeInTheDocument();
  });

  test('a museum whose pictures are refused has no door', async () => {
    setupAICAllArtResponse(aicArtResponse);
    refuseAICPictures();
    setupHarvardAllArtResponse(harvardArtResponse);

    render(<TestApp at={Paths.artGallery}/>);

    await waitFor(() => expect(galleryWall.frames()).toHaveLength(limits.record));
    expect(galleryPage.museum('Harvard Art Museums')).toBeInTheDocument();
    expect(galleryPage.museumIfAny('The Art Institute of Chicago')).not.toBeInTheDocument();
  });

  test('the gallery opens at the first museum that answers', async () => {
    setupAICAllArtResponse(aicArtResponse);
    refuseAICPictures();
    setupHarvardAllArtResponse(harvardArtResponse);

    render(<TestApp at={Paths.artGallery}/>);

    await waitFor(() => expect(galleryWall.frames()).toHaveLength(limits.record));
    expect(galleryPage.urlSearch()).toHaveTextContent('tab=harvard');
  });

  test('a door to a closed museum leads to an open one', async () => {
    setupAICAllArtResponse(aicArtResponse);
    refuseAICPictures();
    setupHarvardAllArtResponse(harvardArtResponse);

    render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);

    await waitFor(() => expect(galleryPage.urlSearch()).toHaveTextContent('tab=harvard'));
    await waitFor(() => expect(galleryWall.frames()).toHaveLength(limits.record));
  });

  test('a door that names no museum leads to the first open one', async () => {
    setupAICAllArtResponse(aicArtResponse);

    render(<TestApp at={`${Paths.artGallery}?tab=bogus`}/>);

    await waitFor(() => expect(galleryPage.urlSearch()).toHaveTextContent('tab=aic'));
    await waitFor(() => expect(galleryWall.frames()).toHaveLength(limits.record));
  });

  test('the first open museum is the door, however quickly the museums answer', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const aicAnswers = heldAICPictures();

    render(<TestApp at={Paths.artGallery}/>);
    await galleryPage.museumAppears('The Victoria and Albert Museum');

    aicAnswers();

    expect(await galleryPage.currentMuseum('The Art Institute of Chicago')).toBeInTheDocument();
    expect(galleryPage.urlSearch()).toHaveTextContent('tab=aic');
  });

  test('while the museums are asked there are no doors, only the loading sign', async () => {
    setupAICAllArtResponse(aicArtResponse);
    heldAICPictures();
    heldVAMPictures();

    render(<TestApp at={Paths.artGallery}/>);

    expect(galleryWall.loadingSigns()).toHaveLength(1);
    expect(galleryPage.museumsIfAny()).not.toBeInTheDocument();
  });

  test('opened on a museum while another museum is still asked, the wall is the one thing loading, and stays the only one', async () => {
    const wallArrives = heldAICAllArtResponse(aicArtResponse, {limit: limits.record, page: 1});
    const vamAnswers = heldVAMPictures();
    render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);
    await galleryPage.museumsAppear();

    expect(galleryWall.loadingSigns()).toHaveLength(1);

    wallArrives();
    await galleryWall.framesAppear();

    expect(galleryWall.loadingSigns()).toHaveLength(0);

    vamAnswers();
    await galleryPage.museumAppears('The Victoria and Albert Museum');

    expect(galleryWall.loadingSigns()).toHaveLength(0);
  });

  test('opened on a link to a museum’s page 2 while another museum is still asked, the wall is the one thing loading, and stays the only one', async () => {
    const wallArrives = heldAICAllArtResponse(aicArtResponse, {limit: limits.record, page: 2});
    const vamAnswers = heldVAMPictures();
    render(<TestApp at={`${Paths.artGallery}?tab=aic&page=2`}/>);
    await galleryPage.museumsAppear();

    expect(galleryWall.loadingSigns()).toHaveLength(1);

    wallArrives();
    await galleryWall.framesAppear();

    expect(galleryWall.loadingSigns()).toHaveLength(0);

    vamAnswers();
    await galleryPage.museumAppears('The Victoria and Albert Museum');

    expect(galleryWall.loadingSigns()).toHaveLength(0);
  });

  test('switching museums while another is still asked keeps one thing loading until the new wall is hung', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const vamWallArrives = heldVAMAllArtResponse(vamArtResponse);
    harvardNeverAnswers();
    render(<TestApp at={`${Paths.artGallery}?tab=aic`}/>);
    await galleryWall.framesAppear();

    await galleryPage.enter('The Victoria and Albert Museum');

    expect(galleryWall.loadingSigns()).toHaveLength(1);
    vamWallArrives();
    await waitFor(() => expect(galleryWall.loadingSign()).not.toBeInTheDocument());
  });

  test('the doors appear once the museums answer', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const aicAnswers = heldAICPictures();
    const vamAnswers = heldVAMPictures();
    render(<TestApp at={Paths.artGallery}/>);

    aicAnswers();
    vamAnswers();

    expect(await galleryPage.museumsAppear()).toBeInTheDocument();
  });

  test('when no museum is open the page says so', async () => {
    refuseAICPictures();
    refuseVAMPictures();

    render(<TestApp at={Paths.artGallery}/>);

    expect(await galleryPage.noMuseumOpen()).toBeInTheDocument();
    expect(galleryPage.museumsIfAny()).not.toBeInTheDocument();
    expect(galleryWall.loadingSign()).not.toBeInTheDocument();
  });

  test('the count of works stays while the next page loads', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const nextPageArrives = heldAICAllArtResponse(aicArtResponse, {limit: limits.record, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    await galleryPage.nextPage();

    await galleryWall.loadingSignAppears();
    expect(galleryPage.pagination()).toHaveTextContent(`of ${aicArtResponse.pagination.total}`);

    nextPageArrives();

    await waitFor(() => expect(galleryWall.loadingSign()).not.toBeInTheDocument());
  });

  test('while the next page is on its way the wall shows the loading sign and does not say the museum answered with nothing', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const nextPageArrives = heldAICAllArtResponse(aicArtResponse, {limit: limits.record, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    await galleryPage.nextPage();

    await galleryWall.loadingSignAppears();
    expect(galleryPage.emptyWallIfAny()).not.toBeInTheDocument();

    nextPageArrives();

    await waitFor(() => expect(galleryWall.loadingSign()).not.toBeInTheDocument());
  });

  test('on the last page the count ends at the total', async () => {
    const {total_pages: last, limit, total} = aicArtResponse.pagination;
    setupAICAllArtResponse(aicArtResponse, {limit, page: last});
    render(<TestApp at={`${Paths.artGallery}?page=${last}`}/>);
    await galleryWall.framesAppear();

    expect(galleryPage.pagination()).toHaveTextContent(`${1 + limit * (last - 1)} - ${total} of ${total}`);
  });
});
