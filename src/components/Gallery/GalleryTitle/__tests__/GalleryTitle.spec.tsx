import {renderGalleryWithRouter} from '../../../../__tests__/util';
import {GalleryTitle} from '../';
import {screen} from '@testing-library/react';
import {Paths} from '../../../../routes/Paths';

const title = 'some cool title';
const path = Paths.artGallery;

describe('gallery title', () => {
  test('viewing', async () => {
    renderGalleryWithRouter(<GalleryTitle/>, {path, initialRoute: path});

    expect(await screen.findByText('Gallery')).toBeInTheDocument();
  });

  test('viewing a piece', () => {
    renderGalleryWithRouter(<GalleryTitle/>, {path: Paths.artGalleryPiece, initialRoute: `${path}/123`, pieceState: {title}});

    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
