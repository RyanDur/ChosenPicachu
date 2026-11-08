import {appAddress} from '@__test_support/address';
import {TestApp} from '@__test_support/TestApp';
import {GalleryProviders} from '@pages/Gallery/Providers';
import {render} from '@testing-library/react';
import {Image} from '@pages/Gallery/Image';
import {Source} from '@pages/Gallery/source';
import {Paths} from '@frame/navigation';
import {aPiece} from '@pages/Gallery/__test_support/fixtures';
import {imageOf} from '@pages/Gallery/Image/__test_support';

describe('the image', () => {
  const piece = aPiece();
  const image = imageOf(piece);

  test('shows a loading sign while the picture is on its way', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><GalleryProviders gallery={Paths.artGallery}><Image piece={piece}/></GalleryProviders></TestApp>);

    expect(image.loading()).toBeInTheDocument();
    expect(image.standInIfAny()).not.toBeInTheDocument();
  });

  test('clicking a picture opens that piece', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=aic`}><GalleryProviders gallery={Paths.artGallery}><Image piece={piece}/></GalleryProviders></TestApp>);

    await image.open();

    expect(appAddress.path()).toHaveTextContent(`${Paths.artGallery}${piece.id}`);
  });

  test('a piece links to itself without a museum when the address names none it knows', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=louvre`}><GalleryProviders gallery={Paths.artGallery}><Image piece={piece}/></GalleryProviders></TestApp>);

    expect(image.link()).toHaveAttribute('href', `${Paths.artGallery}${piece.id}`);
  });

  test('shows a stand-in when the piece has no picture', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=${Source.AIC}`}><GalleryProviders gallery={Paths.artGallery}><Image piece={{...piece, picture: undefined}}/></GalleryProviders></TestApp>);

    expect(image.nothingToShow()).toBeInTheDocument();
    expect(image.loadingIfAny()).not.toBeInTheDocument();
    expect(image.pictureIfAny()).not.toBeInTheDocument();
  });

  test('a picture with its link off offers no way to open the piece', () => {
    render(<TestApp at={`${Paths.artGallery}?page=3&tab=${Source.AIC}`}><GalleryProviders gallery={Paths.artGallery}><Image piece={piece} linkEnabled={false}/></GalleryProviders></TestApp>);

    expect(image.linkIfAny()).not.toBeInTheDocument();
  });
});
