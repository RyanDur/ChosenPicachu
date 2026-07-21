import {anyRequestFailsToConnect} from '@test-support/server';
import {screen, waitFor} from '@testing-library/react';
import {renderWithGalleryContext, renderWithMemoryRouter} from '@test-support';
import {ArtGallery} from '@components/art-gallery/Art/index';
import {Source} from '@components/art-gallery/museums/types/resource';
import {aicArtResponse} from '@test-support/fixtures';
import {test} from 'vitest';
import {Gallery} from '@pages/Gallery';
import {Paths} from '@libraries/routing/Paths';
import {setupAICAllArtResponse} from '@components/art-gallery/__tests__/galleryApiTestHelper';

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('when the art is loading', async () => {
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    expect(screen.queryByTestId('gallery-loading')).toBeInTheDocument();
    expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument());
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
