import {appAddress} from '@__test_support/address';
import {TestApp} from '@__test_support/TestApp';
import {render, waitFor} from '@testing-library/react';
import {aicArtResponse} from '@pages/Gallery/__test_support/fixtures';
import {Paths} from '@navigation';
import {heldAICAllArtResponse, setupAICEveryPage, galleryWall} from '@pages/Gallery/__test_support';
import {pageControl} from '@pages/Gallery/PageControl/__test_support';

describe('The page controls', () => {
  describe('going to a specific page', () => {
    test('going to a page clears the field', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await galleryWall.framesAppear();

      await pageControl.typePage('3');
      await pageControl.go();

      await waitFor(() => expect(appAddress.search()).toHaveTextContent('page=3'));
      expect(pageControl.pageField()).toHaveValue(null);
    });

    test('after going to a page, the field says which page it is', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await galleryWall.framesAppear();

      await pageControl.typePage('3');
      await pageControl.go();

      expect(await pageControl.pageFieldSaysAppears(3)).toBeInTheDocument();
    });

    test('changing only the page size keeps the page the nav walked to', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await galleryWall.framesAppear();
      await pageControl.nextPage();
      await pageControl.pageFieldSaysAppears(2);
      await pageControl.nextPage();
      await pageControl.pageFieldSaysAppears(3);

      await pageControl.typeSize('45');
      await pageControl.go();

      await waitFor(() => expect(appAddress.search()).toHaveTextContent('size=45'));
      expect(appAddress.search()).toHaveTextContent('page=3');
    });

    it('the page field will not go before the first', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await galleryWall.framesAppear();

      await pageControl.typePage('0');

      expect(pageControl.pageField()).toBeInvalid();
    });

    it('the page field will not go past the last page the museum has', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await galleryWall.framesAppear();

      await pageControl.typePage(`${aicArtResponse.pagination.total_pages + 1}`);

      expect(pageControl.pageField()).toBeInvalid();
    });

    it('has no ceiling until the museum says where the end is', async () => {
      const artArrives = heldAICAllArtResponse(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await pageControl.typePage(`${aicArtResponse.pagination.total_pages + 1}`);
      expect(pageControl.pageField()).toBeValid();

      artArrives();

      await waitFor(() => expect(pageControl.pageField()).toBeInvalid());
    });

    test('a page typed and then rubbed out leaves the page where the URL has it', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={`${Paths.artGallery}?page=4`}/>);
      await galleryWall.framesAppear();

      await pageControl.typePage('7');
      await pageControl.rubOutPage();
      await pageControl.go();

      await waitFor(() => expect(appAddress.search()).toHaveTextContent('page=4'));
      expect(appAddress.search()).not.toHaveTextContent('page=7');
    });
  });

  describe('changing the number of elements', () => {
    it('should allow the user to change the elements per page', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await galleryWall.framesAppear();

      await pageControl.typeSize('45');
      await pageControl.go();

      await waitFor(() => expect(appAddress.search()).toHaveTextContent('size=45'));
    });
  });
});
