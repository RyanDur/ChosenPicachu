import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {Paths} from '@navigation';
import {aicArtResponse} from '@pages/Gallery/__test_support/fixtures';
import {galleryWall, setupAICEveryPage} from '@pages/Gallery/__test_support';
import {searchPage} from '@pages/Gallery/Search/__test_support';
import {pageControl} from '@pages/Gallery/PageControl/__test_support';
import {galleryForms} from '../galleryForms';

const historyMovesBackBeforeReactDrawsTheMove = (): void => {
  window.history.pushState(null, '', '#moved');
  window.history.back();
};

beforeAll(() => galleryForms(window).putBackOnBackAndForward());

describe('moving back through history', () => {
  test('the gallery search drops words typed and shows the address\'s words', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?search=roses`}/>);
    await galleryWall.framesAppear();
    await searchPage.bar.type(' and lilies');

    historyMovesBackBeforeReactDrawsTheMove();

    await waitFor(() => expect(searchPage.bar.query()).toHaveValue('roses'));
  });

  test('the gallery page field drops a page typed and shows the address\'s page', async () => {
    setupAICEveryPage(aicArtResponse);
    render(<TestApp at={`${Paths.artGallery}?page=2`}/>);
    await galleryWall.framesAppear();
    await pageControl.typePage('5');

    historyMovesBackBeforeReactDrawsTheMove();

    await waitFor(() => expect(pageControl.pageField()).toHaveValue(2));
  });
});
