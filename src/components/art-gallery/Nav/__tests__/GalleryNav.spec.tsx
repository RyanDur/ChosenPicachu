import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fromAICArt} from '@test-support/fixtures';
import {Paths} from '@pages/Paths';
import {GalleryNav} from '@components/art-gallery/Nav';

describe('Gallery Navigation', () => {
  test('on load', () => {
    render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

    expect(screen.getByLabelText('url search')).not.toHaveTextContent('page');
  });

  describe('without params', () => {
    describe('from the first page', () => {
      it('goes to the next page, and returns to the top', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);
        const landings = vi.spyOn(window, 'scrollTo');
        await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

        expect(screen.getByLabelText('url search')).toHaveTextContent('page=2');
        expect(landings).toHaveBeenCalledTimes(1);
        expect(landings).toHaveBeenCalledWith(0, 0);

        await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

        expect(screen.getByLabelText('url search')).toHaveTextContent('page=3');
        expect(landings).toHaveBeenCalledTimes(2);
        landings.mockRestore();
      });

      test('when on the first page', () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
      });

      test('when jumping to the last page', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);
        await userEvent.click(screen.getByRole('link', {name: 'LAST'}));

        expect(screen.getByLabelText('url search')).toHaveTextContent(`?page=${fromAICArt.pagination.totalPages}`);
        expect(screen.queryByRole('link', {name: 'LAST'})).not.toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'NEXT'})).not.toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'FIRST'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'PREV'})).toBeInTheDocument();
      });
    });

    describe('from the last page', () => {
      it('should be able to go to the previous page', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        await userEvent.click(screen.getByRole('link', {name: 'LAST'}));
        await userEvent.click(screen.getByRole('link', {name: 'PREV'}));

        expect(screen.getByLabelText('url search')).toHaveTextContent(
          `page=${fromAICArt.pagination.totalPages - 1}`
        );

        await userEvent.click(screen.getByRole('link', {name: 'PREV'}));

        expect(screen.getByLabelText('url search')).toHaveTextContent(
          `page=${fromAICArt.pagination.totalPages - 2}`
        );
      });

      it('should not go past the last page', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        await userEvent.click(screen.getByRole('link', {name: 'LAST'}));

        expect(screen.queryByRole('link', {name: 'NEXT'})).not.toBeInTheDocument();
      });

      it('should not be able to jump to the last page', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        await userEvent.click(screen.getByRole('link', {name: 'LAST'}));

        expect(screen.queryByRole('link', {name: 'LAST'})).not.toBeInTheDocument();
      });

      it('should be able to go to the first page', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        await userEvent.click(screen.getByRole('link', {name: 'LAST'}));
        await userEvent.click(screen.getByRole('link', {name: 'FIRST'}));

        expect(screen.getByLabelText('url search')).toHaveTextContent('page=1');
        expect(screen.getByRole('link', {name: 'LAST'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'NEXT'})).toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
      });
    });
  });

  test('with existing params', async () => {
    render(<TestApp at={`${Paths.artGallery}?search=q`}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));
    expect(screen.getByLabelText('url search')).toHaveTextContent('search=q&page=2');

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));
    expect(screen.getByLabelText('url search')).toHaveTextContent('search=q&page=3');

    await userEvent.click(screen.getByRole('link', {name: 'LAST'}));
    expect(screen.getByLabelText('url search')).toHaveTextContent(
      `search=q&page=${fromAICArt.pagination.totalPages}`
    );

    await userEvent.click(screen.getByRole('link', {name: 'PREV'}));
    expect(screen.getByLabelText('url search')).toHaveTextContent(
      `search=q&page=${fromAICArt.pagination.totalPages - 1}`
    );

    await userEvent.click(screen.getByRole('link', {name: 'PREV'}));
    expect(screen.getByLabelText('url search')).toHaveTextContent(
      `search=q&page=${fromAICArt.pagination.totalPages - 2}`
    );

    await userEvent.click(screen.getByRole('link', {name: 'FIRST'}));
    expect(screen.getByLabelText('url search')).toHaveTextContent(
      'search=q&page=1'
    );
  });

  test('page information', () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${fromAICArt.pagination.limit}`}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);
    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent(`${1} - ${fromAICArt.pagination.limit}of${fromAICArt.pagination.total}`);
  });
});
