import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/react';
import {fromAICArt} from '@test-support/fixtures';
import {renderWithGalleryContext} from '@test-support';
import {PageControl} from '@components/art-gallery/PageControl/index';
import {Paths} from '@pages/Paths';

window.scrollTo = vi.fn();
describe('The page controls', () => {
  beforeEach(() => {
    vi.mocked(window.scrollTo).mockRestore();
  });

  describe('going to a specific page', () => {
    test('submitting the specified page', async () => {
      const pageNumber = String(Math.floor(Math.random() * 1000));

      renderWithGalleryContext(<PageControl/>, {
        path: Paths.artGallery,
        initialRoute: Paths.artGallery
      });
      await userEvent.type(screen.getByTestId('go-to'), pageNumber);
      await userEvent.click(screen.getByText('Go'));

      expect(screen.getByTestId('subject-url-search')).toHaveTextContent(`?page=${pageNumber}`);
      expect(screen.getByTestId('go-to')).not.toHaveValue(+pageNumber);
    });

    it('should not go to the top of page when clicking on page number input', async () => {
      renderWithGalleryContext(<PageControl/>, {path: Paths.artGallery, initialRoute: Paths.artGallery});
      await userEvent.click(screen.getByTestId('go-to'));
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('should not allow a user to go to a page lower than the first', () => {
      renderWithGalleryContext(<PageControl/>, {path: Paths.artGallery, initialRoute: Paths.artGallery});
      expect(screen.getByTestId('go-to')).toHaveAttribute('min', '1');
    });

    it('should not allow a user to go to a page higher than the last', async () => {
      renderWithGalleryContext(<PageControl/>, {
        path: Paths.artGallery,
        initialRoute: Paths.artGallery,
        galleryState: fromAICArt
      });
      expect(await screen.findByTestId('go-to'))
        .toHaveAttribute('max', `${fromAICArt.pagination.totalPages}`);
    });
  });

  describe('changing the number of elements', () => {
    it('should allow the user to change the elements per page', async () => {
      renderWithGalleryContext(<PageControl/>, {
        path: Paths.artGallery,
        initialRoute: Paths.artGallery
      });

      await userEvent.type(screen.getByTestId('per-page'), '45');
      await userEvent.click(screen.getByText('Go'));

      expect(await screen.findByTestId('subject-url-search')).toHaveTextContent('size=45');
    });
  });
});
