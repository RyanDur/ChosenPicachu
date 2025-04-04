import userEvent from '@testing-library/user-event';
import {fireEvent, screen} from '@testing-library/react';
import {fromAICArt} from '../../../../dummyData';
import {renderWithGalleryContext} from '../../../../__tests__/util';
import {PageControl} from '../index';
import {Source} from '../../resource/types/resource';
import {Paths} from '../../../../routes/Paths';

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
      fireEvent.submit(screen.getByText('Go'));

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

    it.each`
        input  | size
        ${1}   | ${1}
        ${2}   | ${2}
        ${3}   | ${3}
        ${4}   | ${4}
        ${5}   | ${5}
        ${6}   | ${6}
        ${7}   | ${7}
        ${8}   | ${8}
        ${9}   | ${9}
        ${10}  | ${10}
        ${12}  | ${10}
        ${15}  | ${20}
        ${23}  | ${20}
        ${27}  | ${30}
        ${31}  | ${30}
        ${38}  | ${40}
        ${42}  | ${40}
        ${47}  | ${50}
        ${54}  | ${50}
        ${55}  | ${60}
        ${61}  | ${60}
        ${67}  | ${70}
        ${72}  | ${70}
        ${79}  | ${80}
        ${83}  | ${80}
        ${88}  | ${90}
        ${92}  | ${90}
        ${97}  | ${100}
        ${100} | ${100}
        `('should change input: $input to size: $size when rikjs',
      async ({input, size}: { input: number, size: number }) => {
        renderWithGalleryContext(<PageControl/>, {
          path: Paths.artGallery,
          initialRoute: Paths.artGallery,
          params: {tab: Source.RIJKS, page: 1}
        });
        await userEvent.type(screen.getByTestId('per-page'), `${input}`);

        expect(screen.getByTestId('per-page')).toHaveDisplayValue(String(size));

        await userEvent.click(screen.getByText('Go'));

        expect(screen.getByTestId('subject-url-search')).toHaveTextContent(`tab=${Source.RIJKS}&page=1&size=${size}`);
      });
  });
});
