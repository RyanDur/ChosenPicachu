import {TestApp} from '@test-support/TestApp';
import userEvent from '@testing-library/user-event';
import {render, screen, waitFor} from '@testing-library/react';
import {aicArtResponse} from '@test-support/fixtures';
import {Paths} from '@pages/Paths';
import {atTheTop, landingsDuring} from '@test-support/landings';
import {heldAICAllArtResponse, setupAICEveryPage, wallHangs} from '@components/art-gallery/__test_support';

describe('The page controls', () => {
  describe('going to a specific page', () => {
    test('going to a page lands at its top, and clears the field', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await wallHangs();

      const landings = await landingsDuring(async () => {
        await userEvent.type(screen.getByLabelText(/Page #/), '3');
        await userEvent.click(screen.getByRole('button', {name: 'Go'}));

        await waitFor(() =>
          expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=3'));
      });

      expect(screen.getByLabelText(/Page #/)).not.toHaveValue(3);
      expect(landings).toContainEqual(atTheTop('main'));
    });

    test('after going to a page, the field says which page it is', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await wallHangs();

      await userEvent.type(screen.getByLabelText('Page #1'), '3');
      await userEvent.click(screen.getByRole('button', {name: 'Go'}));

      expect(await screen.findByLabelText('Page #3')).toBeInTheDocument();
    });

    test('changing only the page size keeps the page the nav walked to', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await wallHangs();
      await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));
      await screen.findByLabelText('Page #2');
      await userEvent.click(screen.getByRole('link', {name: 'NEXT'}));
      await screen.findByLabelText('Page #3');

      await userEvent.type(screen.getByLabelText(/Per Page/), '45');
      await userEvent.click(screen.getByRole('button', {name: 'Go'}));

      await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('size=45'));
      expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=3');
    });

    it('the page field will not go before the first', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await wallHangs();

      expect(screen.getByLabelText(/Page #/)).toHaveAttribute('min', '1');
    });

    it('the page field will not go past the last page the museum has', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await wallHangs();

      expect(screen.getByLabelText(/Page #/)).toHaveAttribute('max', `${aicArtResponse.pagination.total_pages}`);
    });

    it('has no ceiling until the museum says where the end is', async () => {
      const artArrives = heldAICAllArtResponse(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);

      expect(screen.getByLabelText(/Page #/)).not.toHaveAttribute('max');

      artArrives();

      await waitFor(() => expect(screen.getByLabelText(/Page #/)).toHaveAttribute('max', `${aicArtResponse.pagination.total_pages}`));
    });

    test('a page typed and then rubbed out leaves the page where the URL has it', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={`${Paths.artGallery}?page=4`}/>);
      await wallHangs();

      await userEvent.type(screen.getByLabelText('Page #4'), '7');
      await userEvent.clear(screen.getByLabelText('Page #4'));
      await userEvent.click(screen.getByRole('button', {name: 'Go'}));

      await waitFor(() => expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('page=4'));
      expect(screen.getByRole('status', {name: 'url search'})).not.toHaveTextContent('page=7');
    });
  });

  describe('changing the number of elements', () => {
    it('should allow the user to change the elements per page', async () => {
      setupAICEveryPage(aicArtResponse);
      render(<TestApp at={Paths.artGallery}/>);
      await wallHangs();

      await userEvent.type(screen.getByLabelText(/Per Page/), '45');
      await userEvent.click(screen.getByRole('button', {name: 'Go'}));

      expect(await screen.findByRole('status', {name: 'url search'})).toHaveTextContent('size=45');
    });
  });
});
