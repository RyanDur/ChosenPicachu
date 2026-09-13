import {TestApp} from '@test-support/TestApp';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {aicArtResponse} from '@test-support/fixtures';
import {Paths} from '@pages/Paths';
import {atTheTop, landingsDuring} from '@test-support/landings';
import {heldAICAllArtResponse, setupAICEveryPage} from '@components/art-gallery/__test_support';

const {total_pages: lastPage, limit, total} = aicArtResponse.pagination;

const wallHangs = () => screen.findAllByRole('figure');

describe('Gallery Navigation', () => {
  test('no page is asked for until someone asks', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await wallHangs();

    expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('page');
  });

  test('the next page is a page on, and starts at the top', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await wallHangs();

    const landings = await landingsDuring(() => userEvent.click(screen.getByRole('link', {name: 'NEXT'})));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=2');
    expect(landings).toContainEqual(atTheTop('page'));
    expect(landings).toContainEqual(atTheTop('main'));
    expect(landings.filter(({where}) => where === 'elsewhere')).toEqual([]);
  });

  test('there is no way back from the first page', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await wallHangs();

    expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
  });

  test('the last page offers only the way back', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await wallHangs();

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
    await wallHangs();

    await userEvent.click(screen.getByRole('link', {name: 'PREV'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent(`page=${lastPage - 1}`);
  });

  test('the first page is one jump back from anywhere', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=${lastPage}`}/>);
    await wallHangs();

    await userEvent.click(screen.getByRole('link', {name: 'FIRST'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=1');
    expect(screen.getByRole('link', {name: 'LAST'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'NEXT'})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'FIRST'})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: 'PREV'})).not.toBeInTheDocument();
  });

  test('a page change keeps the search that was made', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?search=q`}/>);
    await wallHangs();

    await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));

    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('search=q');
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=2');
  });

  test('the pagination counts the works showing, of the total', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${limit}`}/>);
    await wallHangs();

    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent(`${1} - ${limit}of${total}`);
  });

  test('before any page has arrived, the total is a dash', () => {
    heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(screen.getByRole('navigation', {name: 'pagination'})).toHaveTextContent('of—');
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
});
