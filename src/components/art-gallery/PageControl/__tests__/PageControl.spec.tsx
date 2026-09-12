import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor} from '@testing-library/react';
import {fromAICArt} from '@test-support/fixtures';
import {PageControl} from '@components/art-gallery/PageControl';
import {Paths} from '@pages/Paths';

window.scrollTo = vi.fn();
describe('The page controls', () => {
  beforeEach(() => {
    vi.mocked(window.scrollTo).mockRestore();
  });

  describe('going to a specific page', () => {
    test('submitting the specified page', async () => {
      const pageNumber = String(Math.floor(Math.random() * 1000));

      render(<TestApp at={Paths.artGallery}><GalleryProviders><PageControl/></GalleryProviders></TestApp>);
      await userEvent.type(screen.getByLabelText(/Page #/), pageNumber);
      await userEvent.click(screen.getByText('Go'));

      await waitFor(() =>
        expect(screen.getByLabelText('url search')).toHaveTextContent(`?page=${pageNumber}`));
      expect(screen.getByLabelText(/Page #/)).not.toHaveValue(+pageNumber);
    });

    it('should not go to the top of page when clicking on page number input', async () => {
      render(<TestApp at={Paths.artGallery}><GalleryProviders><PageControl/></GalleryProviders></TestApp>);
      const landings = vi.mocked(window.scrollTo).mock.calls.length;
      await userEvent.click(screen.getByLabelText(/Page #/));
      expect(window.scrollTo).toHaveBeenCalledTimes(landings);
    });

    it('should not allow a user to go to a page lower than the first', () => {
      render(<TestApp at={Paths.artGallery}><GalleryProviders><PageControl/></GalleryProviders></TestApp>);
      expect(screen.getByLabelText(/Page #/)).toHaveAttribute('min', '1');
    });

    it('should not allow a user to go to a page higher than the last', async () => {
      render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><PageControl/></GalleryProviders></TestApp>);
      expect(await screen.findByLabelText(/Page #/))
        .toHaveAttribute('max', `${fromAICArt.pagination.totalPages}`);
    });
  });

  describe('changing the number of elements', () => {
    it('should allow the user to change the elements per page', async () => {
      render(<TestApp at={Paths.artGallery}><GalleryProviders><PageControl/></GalleryProviders></TestApp>);

      await userEvent.type(screen.getByLabelText(/Per Page/), '45');
      await userEvent.click(screen.getByText('Go'));

      expect(await screen.findByLabelText('url search')).toHaveTextContent('size=45');
    });
  });
});
