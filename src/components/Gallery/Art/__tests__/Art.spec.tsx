import {screen, waitFor} from '@testing-library/react';
import {renderWithGalleryContext} from '../../../../__tests__/util';
import {ArtGallery} from '../index';
import {Source} from '../../resource/types/resource';
import {aicArtResponse} from '../../../../__tests__/util/dummyData';

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('when there is no art to show', async () => {
    fetchMock.mockResponse(JSON.stringify({...aicArtResponse, data: []}));
    renderWithGalleryContext(<ArtGallery/>, {params: {page: 0, search: 'g', size: 8, tab: Source.AIC}});

    await waitFor(() => expect(screen.queryByTestId(/piece/)).not.toBeInTheDocument());
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    fetchMock.mockReject();

    renderWithGalleryContext(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.HARVARD}});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
  });
});
