import {anyRequestFailsToConnect} from '@test-support/server';
import {delay, http as handle, HttpResponse} from 'msw';
import {server} from '@test-support/server';
import {env} from '@components/Env';
import {screen, waitFor} from '@testing-library/react';
import {renderWithGalleryContext, renderWithMemoryRouter} from '@test-support';
import {ArtGallery} from '@components/art-gallery/Art/index';
import {Source} from '@components/art-gallery/museums/types/resource';
import {aicArtResponse} from '@test-support/fixtures';
import {test} from 'vitest';
import {Gallery} from '@pages/Gallery';
import {Paths} from '@pages/Paths';
import {setupAICAllArtResponse} from '@components/art-gallery/__tests__/galleryApiTestHelper';

const {aicDomain} = env;

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('loads the wall exactly once on mount', async () => {
    let hits = 0;
    const count = () => hits++;
    server.events.on('request:start', count);
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await screen.findAllByRole('figure');
    server.events.removeListener('request:start', count);

    expect(hits).toEqual(1);
  });

  test('only the first rows race for the wire; the rest wait below the fold', async () => {
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    const figures = await screen.findAllByRole('figure');
    const walls = figures.map(figure => figure.querySelector('img.piece'));
    expect(walls.length).toBeGreaterThan(6);
    walls.slice(0, 6).forEach(img => expect(img).not.toHaveAttribute('loading', 'lazy'));
    walls.slice(6).forEach(img => expect(img).toHaveAttribute('loading', 'lazy'));
  });

  test('when the art is loading', async () => {
    server.use(handle.get(`${aicDomain}/search`, async () => {
      await delay(150);
      return HttpResponse.json(aicArtResponse);
    }));
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    expect(await screen.findByRole('progressbar', {name: 'loading gallery'})).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument());
  });

  test('when there is no art to show', async () => {
    setupAICAllArtResponse({...aicArtResponse, data: []}, {page: 0, search: 'g', limit: 8});
    renderWithGalleryContext(<ArtGallery/>, {params: {page: 0, search: 'g', size: 8, tab: Source.AIC}});

    expect(await screen.findByAltText('empty gallery')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    anyRequestFailsToConnect();

    renderWithGalleryContext(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.HARVARD}});

    expect(await screen.findByAltText('empty gallery')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
  });
});
