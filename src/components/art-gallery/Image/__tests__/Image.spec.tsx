import {fireEvent, screen} from '@testing-library/react';
import {Image} from '@components/art-gallery/Image/index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '@test-support';
import {Art} from '@components/art-gallery/museums/types/response';
import {Source} from '@components/art-gallery/museums/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '@pages/Paths';

describe('the image', () => {
  const piece: Art = {
    id: faker.lorem.word(),
    title: faker.lorem.words(),
    image: faker.image.url(),
    altText: faker.lorem.sentence(),
    artistInfo: faker.lorem.sentence()
  };

  beforeEach(() => window.scrollTo = vi.fn());

  test('on loading', () => {
    renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    expect(screen.queryByRole('progressbar', {name: 'loading'})).toBeInTheDocument();
    expect(screen.queryByAltText('oops')).not.toBeInTheDocument();
  });

  test('when image loaded', () => {
    renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    fireEvent.load(screen.getByAltText(piece.altText));

    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
    expect(screen.queryByAltText(piece.altText)).toBeInTheDocument();
    expect(screen.queryByAltText('oops')).not.toBeInTheDocument();
  });

  test('when choosing an image', async () => {
    renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    fireEvent.load(screen.getByAltText(piece.altText));
    await userEvent.click(screen.getByAltText(piece.altText));

    expect(screen.getByTestId('subject-url-path').innerHTML).toEqual(`${Paths.artGallery}${piece.id}`);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('on image load error', () => {
    renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    fireEvent.error(screen.getByAltText(piece.altText));

    expect(screen.queryByAltText(piece.altText)).not.toBeInTheDocument();
    expect(screen.queryByAltText('oops')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
  });

  test('without an image', () => {
    renderWithRouter(<Image piece={{...piece, image: undefined}}/>, {
      params: {page: 3, tab: Source.AIC}
    });

    expect(screen.queryByAltText('oops')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
    expect(screen.queryByAltText(piece.altText)).not.toBeInTheDocument();
  });

  test('when the image is disabled', async () => {
    renderWithRouter(<Image piece={piece} linkEnabled={false}/>,
      {path: Paths.artGallery, initialRoute: Paths.artGallery, params: {page: 3, tab: Source.AIC}});

    fireEvent.load(screen.getByAltText(piece.altText));
    await userEvent.click(await screen.findByAltText(piece.altText));

    expect(screen.getByTestId('subject-url-path').innerHTML).toEqual(Paths.artGallery);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
