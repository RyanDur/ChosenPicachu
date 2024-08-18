import {screen} from '@testing-library/react';
import {renderWithGalleryContext, renderWithMemoryRouter} from '../../../../__tests__/util';
import {ArtGallery} from '../index';
import {Source} from '../../resource/types/resource';
import {aicArtResponse} from '../../../../__tests__/util/dummyData';
import {test} from 'vitest';
import {Gallery} from '../../index';
import {Paths} from '../../../../routes/Paths';

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('when the art is loading', async () => {
    fetchMock.mockResponse(JSON.stringify(aicArtResponse));
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    expect(screen.queryByTestId('gallery-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
    expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument();
  });

  test('when there is no art to show', async () => {
    fetchMock.mockResponse(JSON.stringify({...aicArtResponse, data: []}));
    renderWithGalleryContext(<ArtGallery/>, {params: {page: 0, search: 'g', size: 8, tab: Source.AIC}});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
    expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    fetchMock.mockReject();

    renderWithGalleryContext(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.HARVARD}});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
    expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
  });
});
