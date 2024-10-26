import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fromAICArt} from '../../../../dummyData';
import {Paths} from '../../../../routes/Paths';
import {renderWithGalleryContext} from '../../../../__tests__/util';
import {GalleryNav} from '../index';

window.scrollTo = vi.fn();
describe('Gallery Navigation', () => {
  const options = {
    path: Paths.artGallery,
    initialRoute: Paths.artGallery,
    galleryState: fromAICArt
  };

  test('on load', () => {
    renderWithGalleryContext(<GalleryNav/>, options);

    expect(screen.getByTestId('subject-url-search')).toHaveTextContent('page=1&size=0');
  });

  describe('without params', () => {
    describe('from the first page', () => {
      it('should be able to goto the next page', async () => {
        renderWithGalleryContext(<GalleryNav/>, options);
        await userEvent.click(screen.getByTestId('next-page'));

        expect(screen.getByTestId('subject-url-search')).toHaveTextContent('page=2&size=0');
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

        await userEvent.click(screen.getByTestId('next-page'));

        expect(screen.getByTestId('subject-url-search')).toHaveTextContent('page=3&size=0');
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });

      test('when on the first page', () => {
        renderWithGalleryContext(<GalleryNav/>, options);

        expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
      });

      test('when jumping to the last page', async () => {
        renderWithGalleryContext(<GalleryNav/>, options);
        await userEvent.click(screen.getByTestId('last-page'));

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(screen.getByTestId('subject-url-search')).toHaveTextContent(`?page=${fromAICArt.pagination.totalPages}&size=0`);
        expect(screen.queryByTestId('last-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('first-page')).toBeInTheDocument();
        expect(screen.queryByTestId('prev-page')).toBeInTheDocument();
      });
    });

    describe('from the last page', () => {
      it('should be able to go to the previous page', async () => {
        renderWithGalleryContext(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));
        await userEvent.click(screen.getByTestId('prev-page'));

        expect(screen.getByTestId('subject-url-search')).toHaveTextContent(
          `page=${fromAICArt.pagination.totalPages - 1}&size=0`
        );
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

        await userEvent.click(screen.getByTestId('prev-page'));

        expect(screen.getByTestId('subject-url-search')).toHaveTextContent(
          `page=${fromAICArt.pagination.totalPages - 2}&size=0`
        );
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });

      it('should not go past the last page', async () => {
        renderWithGalleryContext(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));

        expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
      });

      it('should not be able to jump to the last page', async () => {
        renderWithGalleryContext(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));

        expect(screen.queryByTestId('last-page')).not.toBeInTheDocument();
      });

      it('should be able to go to the first page', async () => {
        renderWithGalleryContext(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));
        await userEvent.click(screen.getByTestId('first-page'));

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(screen.getByTestId('subject-url-search')).toHaveTextContent('page=1&size=0');
        expect(screen.queryByTestId('last-page')).toBeInTheDocument();
        expect(screen.queryByTestId('next-page')).toBeInTheDocument();
        expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
      });
    });
  });

  test('with existing params', async () => {
    renderWithGalleryContext(<GalleryNav/>, {
      params: {search: 'q'},
      path: Paths.artGallery,
      initialRoute: Paths.artGallery,
      galleryState: fromAICArt
    });

    await userEvent.click(screen.getByTestId('next-page'));
    expect(screen.getByTestId('subject-url-search')).toHaveTextContent('search=q&page=2&size=0');

    await userEvent.click(screen.getByTestId('next-page'));
    expect(screen.getByTestId('subject-url-search')).toHaveTextContent('search=q&page=3&size=0');

    await userEvent.click(screen.getByTestId('last-page'));
    expect(screen.getByTestId('subject-url-search')).toHaveTextContent(
      `search=q&page=${fromAICArt.pagination.totalPages}&size=0`
    );

    await userEvent.click(screen.getByTestId('prev-page'));
    expect(screen.getByTestId('subject-url-search')).toHaveTextContent(
      `search=q&page=${fromAICArt.pagination.totalPages - 1}&size=0`
    );

    await userEvent.click(screen.getByTestId('prev-page'));
    expect(screen.getByTestId('subject-url-search')).toHaveTextContent(
      `search=q&page=${fromAICArt.pagination.totalPages - 2}&size=0`
    );

    await userEvent.click(screen.getByTestId('first-page'));
    expect(screen.getByTestId('subject-url-search')).toHaveTextContent(
      'search=q&page=1&size=0'
    );
  });

  test('page information', () => {
    renderWithGalleryContext(<GalleryNav/>, {
      params: {page: 1, size: fromAICArt.pagination.limit},
      path: Paths.artGallery,
      initialRoute: Paths.artGallery,
      galleryState: fromAICArt
    });
    expect(screen.getByTestId('info')).toHaveTextContent(`${1} - ${fromAICArt.pagination.limit}of${fromAICArt.pagination.total}`);
  });
});
