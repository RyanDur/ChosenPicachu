import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {ArtGallery} from '../index';
import {Art} from '../../../../data/artGallery/types/response';
import {Source} from '../../../../data/artGallery/types/resource';
import {Paths} from '../../../../routes/Paths.ts';
import {aicArtResponse, fromAICArt} from '../../../../__tests__/util/dummyData.tsx';

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  describe('When the art has loaded', () => {
    beforeEach(async () => {
      fetchMock.mockResponse(JSON.stringify(aicArtResponse));
    });

    it('should not signify that it is loading', async () => {
      renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.AIC}});

      await waitFor(() => expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument());
    });

    it('should contain art', async () => {
      renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.AIC}});

      await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(fromAICArt.pagination.limit));
    });

    it('should not signify that the gallery is empty', async () => {
      renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.AIC}});

      await waitFor(() => expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument());
    });

    it('should allow a user to take a closer look at the art', async () => {
      const rendered = renderWithRouter(<ArtGallery/>, {params: {page: 0, search: 'g', size: 8, tab: Source.AIC}});

      await userEvent.click(await screen.findByTestId(`piece-${fromAICArt.pieces[0].id}`));

      await waitFor(() => expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${fromAICArt.pieces[0].id}`));
    });
  });

  test('when there is no art to show', async () => {
    const pieces = [] as Art[];
    fetchMock.mockResponseOnce(JSON.stringify({pieces}));
    renderWithRouter(<ArtGallery/>);

    await waitFor(() => expect(screen.queryAllByTestId(/piece/).length).toEqual(0));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    fetchMock.mockReject();

    renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.HARVARD}});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
  });
});
