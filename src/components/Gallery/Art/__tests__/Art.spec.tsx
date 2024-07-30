import {act, cleanup, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {data} from '../../../../data';
import {fromAICArt, Rendered, renderWithRouter} from '../../../../__tests__/util';
import {useGallery} from '../../Context';
import {ArtGallery} from '../index';
import {asyncFailure, asyncSuccess} from '@ryandur/sand';
import {AllArt, Art} from '../../../../data/artGallery/types/response';
import {Source} from '../../../../data/artGallery/types/resource';
import {explanation, HTTPError} from '../../../../data/types';
import {Mock} from 'vitest';
import {Paths} from '../../../../routes/Paths.ts';

vi.mock('../../Context', () => {
  return ({
    useGallery: vi.fn()
  });
});

const success = asyncSuccess;
const failure = asyncFailure;

describe('The gallery.', () => {
  let rendered: () => Rendered;
  const mockUseGallery = useGallery as Mock;
  window.scrollTo = vi.fn();
  afterEach(cleanup);

  describe('When the art has loaded', () => {
    beforeEach(async () => {
      data.artGallery.getAllArt = () => success(fromAICArt);

      mockUseGallery.mockReturnValue({
        art: fromAICArt,
        updateArt: vi.fn(),
        reset: vi.fn()
      });
      await act(async () => await act(async () => {
        rendered = renderWithRouter(<ArtGallery/>);
      }));
    });

    it('should not signify that it is loading', () =>
      expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument());

    it('should contain art', async () => {
      expect(screen.getAllByTestId(/piece/).length).toEqual(fromAICArt.pagination.limit);
    });

    it('should not signify that the gallery is empty', () =>
      expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument());

    it('should allow a user to take a closer look at the art', async () => {
      await userEvent.click(screen.getByTestId(`piece-${fromAICArt.pieces[0].id}`));
      expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${fromAICArt.pieces[0].id}`);
    });

    it('should reset the art when leaving', () => {
      rendered().result.unmount();
      expect(useGallery().reset).toHaveBeenCalled();
    });
  });

  test('when there is no art to show', async () => {
    const pieces = [] as Art[];
    data.artGallery.getAllArt = () => success({pieces} as AllArt);
    mockUseGallery.mockReturnValue({
      art: {pieces},
      updateArt: vi.fn(),
      reset: vi.fn()
    });

    renderWithRouter(<ArtGallery/>);

    await waitFor(() => expect(screen.queryAllByTestId(/piece/).length).toEqual(0));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    data.artGallery.getAllArt = (query) => {
      expect(query).toEqual({
        page: 23,
        search: 'g',
        size: 8,
        source: Source.HARVARD
      });

      return failure(explanation(HTTPError.UNKNOWN as HTTPError));
    };

    mockUseGallery.mockReturnValue({
      art: fromAICArt,
      updateArt: vi.fn(),
      reset: vi.fn()
    });
    renderWithRouter(<ArtGallery/>, {params: {page: 23, search: 'g', size: 8, tab: Source.HARVARD}});

    expect(await screen.findByTestId('empty-gallery')).toBeInTheDocument();
  });
});
