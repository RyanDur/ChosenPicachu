import {TestApp} from '@__test_support/TestApp';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {aicArtResponse} from '@components/art-gallery/__test_support/fixtures';
import {Paths} from '@pages/Paths';
import {scrolling} from '@components/__test_support/scrolling';
import {heldAICAllArtResponse, setupAICAllArtResponse, setupAICEveryPage, galleryWall} from '@components/art-gallery/__test_support';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {anyRequestFailsToConnect} from '@__test_support/server';

const {total_pages: lastPage, limit, total} = aicArtResponse.pagination;

describe('Gallery Navigation', () => {
  test('no page is asked for until someone asks', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.hangs();

    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('page');
  });

  test('the next page is a page on, and starts at the top', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.hangs();
    const landings = scrolling.recordLandings();

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=2');
    expect(landings).toContainEqual(scrolling.atTheTop('page'));
    expect(landings).toContainEqual(scrolling.atTheTop('main'));
    expect(landings.filter(({where}) => where === 'elsewhere')).toEqual([]);
  });

  test('there is no way back from the first page', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.hangs();

    expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
  });

  test('the last page offers only the way back', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.hangs();

    await userEvent.click(screen.getByRole('link', {name: 'LAST'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`page=${lastPage}`);
    expect(screen.queryByRole('link', {name: 'LAST'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'NEXT'})).not.toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'FIRST'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'PREV'})).toBeInTheDocument();
  });

  test('the previous page is a page back', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=${lastPage}`}/>);
    await galleryWall.hangs();

    await userEvent.click(screen.getByRole('link', {name: 'PREV'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`page=${lastPage - 1}`);
  });

  test('the first page is one jump back from anywhere', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=${lastPage}`}/>);
    await galleryWall.hangs();

    await userEvent.click(screen.getByRole('link', {name: 'FIRST'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=1');
  });

  test('a page change keeps the search that was made', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?search=q`}/>);
    await galleryWall.hangs();

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('search=q');
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=2');
  });

  test('the pagination counts the works showing, of the total', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${limit}`}/>);
    await galleryWall.hangs();

    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent(`${1} - ${limit}of${total}`);
  });

  test('before any page has arrived, no count is said', () => {
    heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(screen.getByRole('navigation', {name: 'pagination'})).not.toHaveTextContent('of');
  });

  test('a museum with nothing to show counts 0 - 0 of 0', async () => {
    setupAICEveryPage({...aicArtResponse, data: [], pagination: {...aicArtResponse.pagination, total: 0, total_pages: 0}});
    render(<TestApp at={Paths.artGallery}/>);

    await waitFor(() => expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent(/^0 - 0of0$/));
  });

  test('a museum that refuses leaves no count from the museum before it', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${limit}`}/>);
    await galleryWall.hangs();
    anyRequestFailsToConnect();

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

    await screen.findByAltText('the museum refused to answer');
    expect(screen.getByRole('navigation', {name: 'pagination'})).not.toHaveTextContent(`${total}`);
  });

  test('until the museum says where the end is, there is no way forward', async () => {
    const artArrives = heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(screen.queryByRole('link', {name: 'NEXT'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'LAST'})).not.toBeInTheDocument();

    artArrives();

    expect(await screen.findByRole('link', {name: 'NEXT'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'LAST'})).toBeInTheDocument();
  });

  test('while the next page is on its way, the way forward and the count stay', async () => {
    setupAICAllArtResponse(aicArtResponse);
    heldAICAllArtResponse(aicArtResponse, {limit: defaultRecordLimit, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.hangs();

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

    expect(screen.getByRole('link', {name: 'NEXT'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'LAST'})).toBeInTheDocument();
    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent(`${limit + 1} - ${limit * 2}of${total}`);
  });

  test('the way forward stays once the next page lands', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const nextPageArrives = heldAICAllArtResponse(aicArtResponse, {limit: defaultRecordLimit, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.hangs();
    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

    nextPageArrives();

    await galleryWall.hangs();
    expect(screen.getByRole('link', {name: 'NEXT'})).toBeInTheDocument();
  });
});
