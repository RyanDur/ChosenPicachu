import {fireEvent, screen} from '@testing-library/react';
import {Image} from '../index';
import userEvent from '@testing-library/user-event';
import {renderWithRouter} from '../../../../__tests__/util';
import {Art} from '../../resource/types/response';
import {Source} from '../../resource/types/resource';
import {faker} from '@faker-js/faker';
import {Paths} from '../../../../routes/Paths';

describe('the image', () => {
  const piece: Art = {
    id: faker.lorem.word(),
    title: faker.lorem.words(),
    image: faker.image.url(),
    altText: faker.lorem.sentence(),
    artistInfo: faker.lorem.sentence()
  };
  const image = `piece-${piece.id}`;

  beforeEach(() => window.scrollTo = vi.fn());

  test('on loading', () => {
    renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    expect(screen.queryByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('when image loaded', () => {
    renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    fireEvent.load(screen.getByTestId(image));

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId(image)).toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('when choosing an image', async () => {
    const rendered = renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    fireEvent.load(screen.getByTestId(image));
    await userEvent.click(screen.getByTestId(image));

    expect(rendered().testLocation?.pathname).toEqual(`${Paths.artGallery}/${piece.id}`);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('on image load error', () => {
    renderWithRouter(<Image piece={piece}/>, {params: {page: 3, tab: 'aic'}});

    fireEvent.error(screen.getByTestId(image));

    expect(screen.queryByTestId(image)).not.toBeInTheDocument();
    expect(screen.queryByTestId('error')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  test('without an image', () => {
    renderWithRouter(<Image piece={{...piece, image: undefined}}/>, {
      params: {page: 3, tab: Source.AIC}
    });

    expect(screen.queryByTestId('error')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId(image)).not.toBeInTheDocument();
  });

  test('when the image is disabled', async () => {
    const rendered = renderWithRouter(<Image piece={piece} linkEnabled={false}/>,
      {path: Paths.artGallery, initialRoute: Paths.artGallery, params: {page: 3, tab: Source.AIC}});

    fireEvent.load(screen.getByTestId(image));
    await userEvent.click(await screen.findByTestId(image));

    expect(rendered().testLocation?.pathname).toEqual(Paths.artGallery);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
