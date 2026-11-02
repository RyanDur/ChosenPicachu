import {TestApp} from '@__test_support/TestApp';
import {render, waitFor} from '@testing-library/react';
import {aicArtResponse} from '@components/art-gallery/__test_support/fixtures';
import {Paths} from '@pages/Paths';
import {scrolling} from '@components/__test_support/scrolling';
import {heldAICAllArtResponse, setupAICAllArtResponse, setupAICEveryPage, galleryWall} from '@components/art-gallery/__test_support';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {anyRequestFailsToConnect} from '@__test_support/server';
import {appAddress} from '@__test_support/address';
import {galleryNav} from '../__test_support';

const {total_pages: lastPage, limit, total} = aicArtResponse.pagination;

describe('Gallery Navigation', () => {
  test('no page is asked for until someone asks', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    expect(appAddress.shown()).not.toContain('page');
  });

  test('the next page is a page on, and starts at the top', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();
    const landings = scrolling.recordLandings();

    await galleryNav.go('NEXT');

    expect(appAddress.shown()).toContain('page=2');
    expect(landings).toContainEqual(scrolling.atTheTop('page'));
    expect(landings.filter(({where}) => where === 'elsewhere')).toEqual([]);
  });

  test('there is no way back from the first page', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    expect(galleryNav.wayIfAny('PREV')).not.toBeInTheDocument();
    expect(galleryNav.wayIfAny('FIRST')).not.toBeInTheDocument();
  });

  test('the last page offers only the way back', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('LAST');

    expect(appAddress.shown()).toContain(`page=${lastPage}`);
    expect(galleryNav.wayIfAny('LAST')).not.toBeInTheDocument();
    expect(galleryNav.wayIfAny('NEXT')).not.toBeInTheDocument();
    expect(galleryNav.way('FIRST')).toBeInTheDocument();
    expect(galleryNav.way('PREV')).toBeInTheDocument();
  });

  test('the previous page is a page back', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=${lastPage}`}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('PREV');

    expect(appAddress.shown()).toContain(`page=${lastPage - 1}`);
  });

  test('the first page is one jump back from anywhere', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=${lastPage}`}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('FIRST');

    expect(appAddress.shown()).toContain('page=1');
  });

  test('a page change keeps the search that was made', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?search=q`}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('NEXT');

    expect(appAddress.shown()).toContain('search=q');
    expect(appAddress.shown()).toContain('page=2');
  });

  test('the pagination counts the works showing, of the total', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${limit}`}/>);
    await galleryWall.framesAppear();

    expect(galleryNav.count()).toHaveTextContent(`${1} - ${limit}of${total}`);
  });

  test('before any page has arrived, no count is said', () => {
    heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(galleryNav.count()).not.toHaveTextContent('of');
  });

  test('a museum with nothing to show counts 0 - 0 of 0', async () => {
    setupAICEveryPage({
      ...aicArtResponse,
      data: [],
      pagination: {...aicArtResponse.pagination, total: 0, total_pages: 0}
    });
    render(<TestApp at={Paths.artGallery}/>);

    await waitFor(() => expect(galleryNav.count()).toHaveTextContent(/^0 - 0of0$/));
  });

  test('a museum that refuses leaves no count from the museum before it', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${limit}`}/>);
    await galleryWall.framesAppear();
    anyRequestFailsToConnect();

    await galleryNav.go('NEXT');

    await galleryWall.standIn('the museum refused to answer');
    expect(galleryNav.count()).not.toHaveTextContent(`${total}`);
  });

  test('until the museum says where the end is, there is no way forward', async () => {
    const artArrives = heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(galleryNav.wayIfAny('NEXT')).not.toBeInTheDocument();
    expect(galleryNav.wayIfAny('LAST')).not.toBeInTheDocument();

    artArrives();

    expect(await galleryNav.wayAppears('NEXT')).toBeInTheDocument();
    expect(galleryNav.way('LAST')).toBeInTheDocument();
  });

  test('while the next page is on its way, the way forward and the count stay', async () => {
    setupAICAllArtResponse(aicArtResponse);
    heldAICAllArtResponse(aicArtResponse, {limit: defaultRecordLimit, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('NEXT');

    expect(galleryNav.way('NEXT')).toBeInTheDocument();
    expect(galleryNav.way('LAST')).toBeInTheDocument();
    expect(galleryNav.count()).toHaveTextContent(`${limit + 1} - ${limit * 2}of${total}`);
  });

  test('the way forward stays once the next page lands', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const nextPageArrives = heldAICAllArtResponse(aicArtResponse, {limit: defaultRecordLimit, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();
    await galleryNav.go('NEXT');

    nextPageArrives();

    await galleryWall.framesAppear();
    expect(galleryNav.way('NEXT')).toBeInTheDocument();
  });
});
