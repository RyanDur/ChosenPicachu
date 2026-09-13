import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fromAICArt} from '@test-support/fixtures';
import {Paths} from '@pages/Paths';
import {GalleryNav} from '@components/art-gallery/Nav';
import {atTheTop, landingsDuring} from '@test-support/landings';

describe('Gallery Navigation', () => {
  test('on load', () => {
    render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('page');
  });

  describe('without params', () => {
    describe('from the first page', () => {
      it('goes to the next page, and returns to the top', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        const landings = await landingsDuring(() => userEvent.click(screen.getByRole('link', {name: 'NEXT'})));
        expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=2');
        expect(landings).toContainEqual(atTheTop('page'));
        expect(landings).toContainEqual(atTheTop('main'));
        expect(landings.filter(({where}) => where === 'elsewhere')).toEqual([]);
      });

      test('there is no way back from the first page', () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
      });

      test('the last page offers only the way back', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);
        await userEvent.click(screen.getByRole('link', {name: 'LAST'}));

        expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?page=${fromAICArt.pagination.totalPages}`);
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

        expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(
          `page=${fromAICArt.pagination.totalPages - 1}`
        );
      });

      it('should be able to go to the first page', async () => {
        render(<TestApp at={Paths.artGallery}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

        await userEvent.click(screen.getByRole('link', {name: 'LAST'}));
        await userEvent.click(screen.getByRole('link', {name: 'FIRST'}));

        expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=1');
        expect(screen.getByRole('link', {name: 'LAST'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'NEXT'})).toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
        expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
      });
    });
  });

  test('a page change keeps the search that was made', async () => {
    render(<TestApp at={`${Paths.artGallery}?search=q`}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('search=q&page=2');
  });

  test('the pagination counts the works showing, of the total', () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${fromAICArt.pagination.limit}`}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);
    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent(`${1} - ${fromAICArt.pagination.limit}of${fromAICArt.pagination.total}`);
  });

  test('before any page has arrived, the total is a dash', () => {
    render(<TestApp at={Paths.artGallery}><GalleryProviders><GalleryNav/></GalleryProviders></TestApp>);

    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent('of—');
  });
});
