import {GalleryProviders} from '@pages/Gallery';
import {TestApp} from '@test-support/TestApp';
import {Route} from 'react-router';
import {anyRequestRespondsWith} from '@test-support/server';
import {render, screen, waitFor, within} from '@testing-library/react';
import {ArtPiece} from '@components/art-gallery';
import {HTTPError} from '@transport/types';
import {faker} from '@faker-js/faker';
import {Paths} from '@pages/Paths';
import {Source} from '@components/art-gallery/museums/types/resource';
import {AICArtResponse} from '@components/art-gallery/museums/aic/types';
import {setupAICArtPieceResponse} from '@components/art-gallery/__tests__/galleryApiTestHelper';

describe('viewing a piece', () => {
  const aicArtResponse: AICArtResponse = {
    data: {
      id: faker.number.int(),
      title: faker.lorem.words(),
      term_titles: [faker.lorem.sentence()],
      artist_display: faker.lorem.paragraph(),
      image_id: faker.lorem.word()
    }
  };

  test('when loading the piece of art', async () => {
    setupAICArtPieceResponse(aicArtResponse, aicArtResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}1234`}><Route path={`${Paths.artGalleryPiece}`} element={<GalleryProviders><ArtPiece/></GalleryProviders>}/></TestApp>);

    await waitFor(() => expect(screen.getByRole('progressbar', {name: 'loading piece'})).toBeInTheDocument());
  });

  test('when the art piece is loaded', async () => {
    setupAICArtPieceResponse(aicArtResponse, aicArtResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${aicArtResponse.data.id}?tab=${Source.AIC}`}><Route path={Paths.artGalleryPiece} element={<GalleryProviders><ArtPiece/></GalleryProviders>}/></TestApp>);

    expect(await screen.findByText(aicArtResponse.data.artist_display)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByAltText('Load Error')).not.toBeInTheDocument());
  });

  test('when getting the piece has errored', async () => {
    anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);
    render(<TestApp at={`${Paths.artGallery}1234`}><Route path={`${Paths.artGalleryPiece}`} element={<GalleryProviders><ArtPiece/></GalleryProviders>}/></TestApp>);

    await waitFor(() => expect(screen.queryByAltText('Load Error')).toBeInTheDocument());
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading piece'})).not.toBeInTheDocument();
    expect(within(screen.getByRole('alert', {hidden: true}))
      .getByText('the museum is having trouble')).toBeInTheDocument();
  });
});
