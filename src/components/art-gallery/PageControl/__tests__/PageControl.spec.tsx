import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor} from '@testing-library/react';
import {fromAICArt} from '@test-support/fixtures';
import {PageControl} from '@components/art-gallery/PageControl';
import {Paths} from '@pages/Paths';

describe('The page controls', () => {
  describe('going to a specific page', () => {
    test('going to a page lands at its top, and clears the field', async () => {
      const pageNumber = '3';

      render(<TestApp at={Paths.artGallery}><GalleryProviders><PageControl/></GalleryProviders></TestApp>);
      const landings = vi.spyOn(window, 'scrollTo');
      try {
        await userEvent.type(screen.getByLabelText(/Page #/), pageNumber);
        await userEvent.click(screen.getByRole('button', {name: 'Go'}));

        await waitFor(() =>
          expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?page=${pageNumber}`));
        expect(screen.getByLabelText(/Page #/)).not.toHaveValue(+pageNumber);
        expect(landings).toHaveBeenCalledTimes(1);
      } finally {
        landings.mockRestore();
      }
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
      await userEvent.click(screen.getByRole('button', {name: 'Go'}));

      expect(await screen.findByRole('status', {name: 'url search'})).toHaveTextContent('size=45');
    });
  });
});
