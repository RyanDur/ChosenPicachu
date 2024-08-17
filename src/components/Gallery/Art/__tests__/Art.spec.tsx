import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithGalleryContext} from '../../../../__tests__/util';
import {ArtGallery} from '../index';
import {Source} from '../../resource/types/resource';
import {Paths} from '../../../../routes/Paths';
import {aicArtResponse, fromAICArt} from '../../../../__tests__/util/dummyData';

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('When the art has loaded', async () => {
    fetchMock.mockResponse(JSON.stringify(aicArtResponse));

    renderWithGalleryContext(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.AIC}});

    await waitFor(() => expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(fromAICArt.pagination.limit));
    await waitFor(() => expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument());
  });

  it('should allow a user to take a closer look at the art', async () => {
    const rendered = renderWithGalleryContext(<ArtGallery/>, {params: {page: 0, search: 'g', size: 8, tab: Source.AIC}});

    await userEvent.click(await screen.findByTestId(`piece-${fromAICArt.pieces[0].id}`));

    await waitFor(() => expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${fromAICArt.pieces[0].id}`));
  });

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
