import {anyRequestFailsToConnect} from '@test-support/server';
import {delay, http as handle, HttpResponse} from 'msw';
import {server} from '@test-support/server';
import {aicDomain} from '@components/art-gallery/museums/config';
import {screen, waitFor} from '@testing-library/react';
import {renderWithGalleryContext, renderWithMemoryRouter} from '@test-support';
import {ArtGallery} from '@components/art-gallery/Art/index';
import {Source} from '@components/art-gallery/museums/types/resource';
import {aicArtResponse} from '@test-support/fixtures';
import {test} from 'vitest';
import {Gallery} from '@pages/Gallery';
import {Paths} from '@pages/Paths';
import {setupAICAllArtResponse} from '@components/art-gallery/__tests__/galleryApiTestHelper';

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('loads the wall exactly once on mount', async () => {
    let hits = 0;
    const count = () => hits++;
    server.events.on('request:start', count);
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await screen.findAllByTestId(/piece-/);
    server.events.removeListener('request:start', count);

    expect(hits).toEqual(1);
  });

  test('when the art is loading', async () => {
    server.use(handle.get(`${aicDomain}/search`, async () => {
      await delay(150);
      return HttpResponse.json(aicArtResponse);
    }));
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    expect(await screen.findByTestId('gallery-loading')).toBeInTheDocument();
    expect(screen.queryByTestId(/piece-/)).not.toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument());
  });

  test('when there is no art to show', async () => {
    setupAICAllArtResponse({...aicArtResponse, data: []}, {page: 0, search: 'g', limit: 8});
    renderWithGalleryContext(<ArtGallery/>, {params: {page: 0, search: 'g', size: 8, tab: Source.AIC}});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
    expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    anyRequestFailsToConnect();

    renderWithGalleryContext(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.HARVARD}});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
    expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
  });
});
