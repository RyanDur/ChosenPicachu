import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {fromAICArt} from '@test-support/fixtures';
import {Paths} from '@pages/Paths';
import {GalleryNav} from '@components/art-gallery/Nav';
import {atTheTop, landingsDuring} from '@test-support/landings';

const galleryNav = (search = '') =>
  render(<TestApp at={`${Paths.artGallery}${search}`}><GalleryProviders galleryState={fromAICArt}><GalleryNav/></GalleryProviders></TestApp>);

const lastPage = fromAICArt.pagination.totalPages;

describe('Gallery Navigation', () => {
  test('no page is asked for until someone asks', () => {
    galleryNav();

    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('page');
  });

  test('the next page is a page on, and starts at the top', async () => {
    galleryNav();

    const landings = await landingsDuring(() => userEvent.click(screen.getByRole('link', {name: 'NEXT'})));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=2');
    expect(landings).toContainEqual(atTheTop('page'));
    expect(landings).toContainEqual(atTheTop('main'));
    expect(landings.filter(({where}) => where === 'elsewhere')).toEqual([]);
  });

  test('there is no way back from the first page', () => {
    galleryNav();

    expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
  });

  test('the last page offers only the way back', async () => {
    galleryNav();

    await userEvent.click(screen.getByRole('link', {name: 'LAST'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`?page=${lastPage}`);
    expect(screen.queryByRole('link', {name: 'LAST'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'NEXT'})).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'FIRST'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'PREV'})).toBeInTheDocument();
  });

  test('the previous page is a page back', async () => {
    galleryNav(`?page=${lastPage}`);

    await userEvent.click(screen.getByRole('link', {name: 'PREV'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`page=${lastPage - 1}`);
  });

  test('the first page is one jump back from anywhere', async () => {
    galleryNav(`?page=${lastPage}`);

    await userEvent.click(screen.getByRole('link', {name: 'FIRST'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=1');
    expect(screen.getByRole('link', {name: 'LAST'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'NEXT'})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
  });

  test('a page change keeps the search that was made', async () => {
    galleryNav('?search=q');

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('search=q&page=2');
  });

  test('the pagination counts the works showing, of the total', () => {
    galleryNav(`?page=1&size=${fromAICArt.pagination.limit}`);

    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent(`${1} - ${fromAICArt.pagination.limit}of${fromAICArt.pagination.total}`);
  });

  test('before any page has arrived, the total is a dash', () => {
    render(<TestApp at={Paths.artGallery}><GalleryProviders><GalleryNav/></GalleryProviders></TestApp>);

    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent('of—');
  });
});
