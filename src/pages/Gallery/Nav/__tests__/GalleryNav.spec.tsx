import {TestApp} from '@__test_support/TestApp';
import {render} from '@testing-library/react';
import {aicArtResponse} from '@pages/Gallery/__test_support/fixtures';
import {Paths} from '@navigation';
import {heldAICAllArtResponse, setupAICAllArtResponse, setupAICEveryPage, galleryWall} from '@pages/Gallery/__test_support';
import {limits} from '@pages/Gallery/limits';
import {anyRequestFailsToConnect} from '@__test_support/server';
import {appAddress} from '@__test_support/address';
import {galleryNav} from '../__test_support';

const {total_pages: lastPage, limit} = aicArtResponse.pagination;

describe('Gallery Navigation', () => {
  test('no page is asked for until someone asks', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    expect(appAddress.shown()).not.toContain('page');
  });

  test('the next page is a page on', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('next page');

    expect(appAddress.shown()).toContain('page=2');
  });

  test('there is no way back from the first page', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    expect(galleryNav.wayIfAny('previous page')).not.toBeInTheDocument();
    expect(galleryNav.wayIfAny('first page')).not.toBeInTheDocument();
  });

  test('the last page offers only the way back', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('last page');

    expect(appAddress.shown()).toContain(`page=${lastPage}`);
    expect(galleryNav.wayIfAny('last page')).not.toBeInTheDocument();
    expect(galleryNav.wayIfAny('next page')).not.toBeInTheDocument();
    expect(galleryNav.way('first page')).toBeInTheDocument();
    expect(galleryNav.way('previous page')).toBeInTheDocument();
  });

  test('the previous page is a page back', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=${lastPage}`}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('previous page');

    expect(appAddress.shown()).toContain(`page=${lastPage - 1}`);
  });

  test('the first page is one jump back from anywhere', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=${lastPage}`}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('first page');

    expect(appAddress.shown()).toContain('page=1');
  });

  test('a page change keeps the search that was made', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?search=q`}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('next page');

    expect(appAddress.shown()).toContain('search=q');
    expect(appAddress.shown()).toContain('page=2');
  });

  test('the pagination says which page it is, of how many', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=2&size=${limit}`}/>);
    await galleryWall.framesAppear();

    expect(galleryNav.pagination()).toHaveTextContent(`Page 2 of ${lastPage}`);
  });

  test('the pagination writes a long count the way the reader writes numbers', async () => {
    setupAICEveryPage({...aicArtResponse, pagination: {...aicArtResponse.pagination, total_pages: 12412}});
    render(<TestApp at={`${Paths.artGallery}?page=1234`}/>);
    await galleryWall.framesAppear();

    expect(galleryNav.pagination()).toHaveTextContent(`Page ${(1234).toLocaleString()} of ${(12412).toLocaleString()}`);
  });

  test('the ways and the count read as separate words, even with the styles off', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=2&size=${limit}`}/>);
    await galleryWall.framesAppear();

    expect(galleryNav.pagination()).toHaveTextContent(
      new RegExp(`^first page previous page Page 2 of ${lastPage} next page last page$`));
  });

  test('before any page has arrived, no count is said', () => {
    heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(galleryNav.pagination()).not.toHaveTextContent('of');
  });

  test('a museum with nothing to show says no count', async () => {
    setupAICEveryPage({
      ...aicArtResponse,
      data: [],
      pagination: {...aicArtResponse.pagination, total: 0, total_pages: 0}
    });
    render(<TestApp at={Paths.artGallery}/>);

    await galleryWall.standIn('the museum answered with nothing');

    expect(galleryNav.pagination()).toHaveTextContent(/^$/);
  });

  test('a museum that refuses leaves no count from the museum before it', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=1&size=${limit}`}/>);
    await galleryWall.framesAppear();
    anyRequestFailsToConnect();

    await galleryNav.go('next page');

    await galleryWall.standIn('the museum refused to answer');
    expect(galleryNav.pagination()).not.toHaveTextContent(`of ${lastPage}`);
  });

  test('until the museum says where the end is, there is no way forward', async () => {
    const artArrives = heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    expect(galleryNav.wayIfAny('next page')).not.toBeInTheDocument();
    expect(galleryNav.wayIfAny('last page')).not.toBeInTheDocument();

    artArrives();

    expect(await galleryNav.wayAppears('next page')).toBeInTheDocument();
    expect(galleryNav.way('last page')).toBeInTheDocument();
  });

  test('while the next page is on its way, the way forward and the count stay', async () => {
    setupAICAllArtResponse(aicArtResponse);
    heldAICAllArtResponse(aicArtResponse, {limit: limits.record, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();

    await galleryNav.go('next page');

    expect(galleryNav.way('next page')).toBeInTheDocument();
    expect(galleryNav.way('last page')).toBeInTheDocument();
    expect(galleryNav.pagination()).toHaveTextContent(`Page 2 of ${lastPage}`);
  });

  test('the way forward stays once the next page lands', async () => {
    setupAICAllArtResponse(aicArtResponse);
    const nextPageArrives = heldAICAllArtResponse(aicArtResponse, {limit: limits.record, page: 2});
    render(<TestApp at={Paths.artGallery}/>);
    await galleryWall.framesAppear();
    await galleryNav.go('next page');

    nextPageArrives();

    await galleryWall.framesAppear();
    expect(galleryNav.way('next page')).toBeInTheDocument();
  });
});
