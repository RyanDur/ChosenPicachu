import {TestApp} from '@test-support/TestApp';
import {fireEvent, render, screen} from '@testing-library/react';
import {Image} from '@components/art-gallery/Image';
import userEvent from '@testing-library/user-event';
import {Art} from '@components/art-gallery/museums/art';
import {Source} from '@components/art-gallery/museums/source';
import {faker} from '@faker-js/faker';
import {Paths} from '@pages/Paths';
import {landingsDuring} from '@test-support/landings';

describe('the image', () => {
  const piece: Art = {
    id: faker.lorem.word(),
    title: faker.lorem.words(),
    image: faker.image.url(),
    altText: faker.lorem.sentence(),
    artistInfo: faker.lorem.sentence()
  };

  test('shows a loading sign while the picture is on its way', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><Image piece={piece}/></TestApp>);

    expect(screen.getByRole('progressbar', {name: 'loading'})).toBeInTheDocument();
    expect(screen.queryByAltText('oops')).not.toBeInTheDocument();
  });

  test('shows the picture and drops the loading sign once it arrives', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><Image piece={piece}/></TestApp>);

    fireEvent.load(screen.getByAltText(piece.altText));

    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
    expect(screen.getByAltText(piece.altText)).toBeInTheDocument();
    expect(screen.queryByAltText('oops')).not.toBeInTheDocument();
  });

  test('clicking a picture opens that piece', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><Image piece={piece}/></TestApp>);

    fireEvent.load(screen.getByAltText(piece.altText));
    await userEvent.click(screen.getByAltText(piece.altText));

    expect(screen.getByRole('status', {name: 'url path'})).toHaveTextContent(`${Paths.artGallery}${piece.id}`);
  });

  test('shows a stand-in when the picture will not load', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><Image piece={piece}/></TestApp>);

    fireEvent.error(screen.getByAltText(piece.altText));

    expect(screen.queryByAltText(piece.altText)).not.toBeInTheDocument();
    expect(screen.getByAltText('oops')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
  });

  test('shows a stand-in when the piece has no picture', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=${Source.AIC}`}><Image piece={{...piece, image: undefined}}/></TestApp>);

    expect(screen.getByAltText('oops')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading'})).not.toBeInTheDocument();
    expect(screen.queryByAltText(piece.altText)).not.toBeInTheDocument();
  });

  test('a picture with its link off goes nowhere when clicked', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=${Source.AIC}`}><Image piece={piece} linkEnabled={false}/></TestApp>);

    fireEvent.load(screen.getByAltText(piece.altText));
    const landings = await landingsDuring(() => userEvent.click(screen.getByAltText(piece.altText)));

    expect(screen.getByRole('status', {name: 'url path'})).toHaveTextContent(new RegExp(`^${Paths.artGallery}$`));
    expect(landings).toEqual([]);
  });
});
