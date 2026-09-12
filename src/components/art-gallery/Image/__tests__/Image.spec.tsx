import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import {fireEvent, render, screen} from '@testing-library/react';
import {Image} from '@components/art-gallery/Image';
import userEvent from '@testing-library/user-event';
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
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><GalleryProviders><Image piece={piece}/></GalleryProviders></TestApp>);

    expect(screen.queryByRole('progressbar', {name: 'loading'})).toBeInTheDocument();
    expect(screen.queryByAltText('oops')).not.toBeInTheDocument();
  });

  test('when image loaded', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><GalleryProviders><Image piece={piece}/></GalleryProviders></TestApp>);

    fireEvent.load(screen.getByAltText(piece.altText));

    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
    expect(screen.queryByAltText(piece.altText)).toBeInTheDocument();
    expect(screen.queryByAltText('oops')).not.toBeInTheDocument();
  });

  test('when choosing an image', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><GalleryProviders><Image piece={piece}/></GalleryProviders></TestApp>);

    fireEvent.load(screen.getByAltText(piece.altText));
    await userEvent.click(screen.getByAltText(piece.altText));

    expect(screen.getByLabelText('url path').innerHTML).toEqual(`${Paths.artGallery}${piece.id}`);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('on image load error', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><GalleryProviders><Image piece={piece}/></GalleryProviders></TestApp>);

    fireEvent.error(screen.getByAltText(piece.altText));

    expect(screen.queryByAltText(piece.altText)).not.toBeInTheDocument();
    expect(screen.queryByAltText('oops')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
  });

  test('without an image', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=${Source.AIC}`}><GalleryProviders><Image piece={{...piece, image: undefined}}/></GalleryProviders></TestApp>);

    expect(screen.queryByAltText('oops')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
    expect(screen.queryByAltText(piece.altText)).not.toBeInTheDocument();
  });

  test('when the image is disabled', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=${Source.AIC}`}><GalleryProviders><Image piece={piece} linkEnabled={false}/></GalleryProviders></TestApp>);
    const landings = vi.mocked(window.scrollTo).mock.calls.length;

    fireEvent.load(screen.getByAltText(piece.altText));
    await userEvent.click(await screen.findByAltText(piece.altText));

    expect(screen.getByLabelText('url path').innerHTML).toEqual(Paths.artGallery);
    expect(window.scrollTo).toHaveBeenCalledTimes(landings);
  });
});
