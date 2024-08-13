import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fromAICArt} from '../../../../__tests__/util/dummyData';
import {GalleryNav} from '../../';
import {Paths} from '../../../../routes/Paths';
import {renderWithRouter} from '../../../../__tests__/util';

window.scrollTo = vi.fn();
describe('Gallery Navigation', () => {
  describe('without params', () => {
    describe('from the first page', () => {
      const options = {
        path: Paths.artGallery,
        initialRoute: Paths.artGallery,
        galleryState: fromAICArt
      };

      it('should be able to goto the next page', async () => {
        const rendered = renderWithRouter(<GalleryNav/>, options);
        await userEvent.click(screen.getByTestId('next-page'));

        expect(rendered().testLocation?.search).toEqual('?page=2');
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

        await userEvent.click(screen.getByTestId('next-page'));

        expect(rendered().testLocation?.search).toEqual('?page=3');
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });

      test('when on the first page', () => {
        renderWithRouter(<GalleryNav/>, options);

        expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
      });

      test('when jumping to the last page', async () => {
        const rendered = renderWithRouter(<GalleryNav/>, options);
        await userEvent.click(screen.getByTestId('last-page'));

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(rendered().testLocation?.search).toEqual(`?page=${fromAICArt.pagination.totalPages}`);
        expect(screen.queryByTestId('last-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('first-page')).toBeInTheDocument();
        expect(screen.queryByTestId('prev-page')).toBeInTheDocument();
      });
    });

    describe('from the last page', () => {
      it('should be able to go to the previous page', async () => {
        const rendered = renderWithRouter(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));
        await userEvent.click(screen.getByTestId('prev-page'));

        expect(rendered().testLocation?.search).toEqual(`?page=${fromAICArt.pagination.totalPages - 1}`);
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

        await userEvent.click(screen.getByTestId('prev-page'));

        expect(rendered().testLocation?.search).toEqual(`?page=${fromAICArt.pagination.totalPages - 2}`);
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });

      it('should not go past the last page', async () => {
        renderWithRouter(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));

        expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
      });

      it('should not be able to jump to the last page', async () => {
        renderWithRouter(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));

        expect(screen.queryByTestId('last-page')).not.toBeInTheDocument();
      });

      it('should be able to go to the first page', async () => {
        const rendered = renderWithRouter(<GalleryNav/>, {
          initialRoute: Paths.artGallery,
          path: Paths.artGallery,
          galleryState: fromAICArt
        });

        await userEvent.click(screen.getByTestId('last-page'));
        await userEvent.click(screen.getByTestId('first-page'));

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(rendered().testLocation?.search).toEqual('?page=1');
        expect(screen.queryByTestId('last-page')).toBeInTheDocument();
        expect(screen.queryByTestId('next-page')).toBeInTheDocument();
        expect(screen.queryByTestId('first-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
      });
    });
  });

  test('with existing params', async () => {
    const rendered = renderWithRouter(<GalleryNav/>, {
      params: {search: 'q'},
      path: Paths.artGallery,
      initialRoute: Paths.artGallery,
      galleryState: fromAICArt
    });

    await userEvent.click(screen.getByTestId('next-page'));
    expect(rendered().testLocation?.search).toEqual('?page=2&search=q');

    await userEvent.click(screen.getByTestId('next-page'));
    expect(rendered().testLocation?.search).toEqual('?page=3&search=q');

    await userEvent.click(screen.getByTestId('last-page'));
    expect(rendered().testLocation?.search).toEqual(`?page=${fromAICArt.pagination.totalPages}&search=q`);

    await userEvent.click(screen.getByTestId('prev-page'));
    expect(rendered().testLocation?.search).toEqual(`?page=${fromAICArt.pagination.totalPages - 1}&search=q`);

    await userEvent.click(screen.getByTestId('prev-page'));
    expect(rendered().testLocation?.search).toEqual(`?page=${fromAICArt.pagination.totalPages - 2}&search=q`);

    await userEvent.click(screen.getByTestId('first-page'));
    expect(rendered().testLocation?.search).toEqual('?page=1&search=q');
  });

  test('page information', () => {
    renderWithRouter(<GalleryNav/>, {
      params: {page: 1, size: fromAICArt.pagination.limit},
      path: Paths.artGallery,
      initialRoute: Paths.artGallery,
      galleryState: fromAICArt
    });
    expect(screen.getByTestId('info')).toHaveTextContent(`${1} - ${fromAICArt.pagination.limit}of${fromAICArt.pagination.total}`);
  });
});
