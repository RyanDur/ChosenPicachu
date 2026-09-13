import {TestApp} from '@test-support/TestApp';
import {anyRequestRespondsWith} from '@test-support/server';
import {render, screen, waitFor, within} from '@testing-library/react';
import {HTTPError} from '@transport/types';
import {faker} from '@faker-js/faker';
import {Paths} from '@pages/Paths';
import {Source} from '@components/art-gallery/museums/source';
import {AICArtResponse} from '@components/art-gallery/museums/aic/types';
import {heldAICArtPieceResponse, setupAICArtPieceResponse} from '@components/art-gallery/__test_support';

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

  test('shows a loading sign and a placeholder title until the piece arrives', async () => {
    const pieceArrives = heldAICArtPieceResponse(aicArtResponse, aicArtResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${aicArtResponse.data.id}?tab=${Source.AIC}`}/>);

    expect(await screen.findByRole('progressbar', {name: 'loading piece'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('A piece');

    pieceArrives();

    await waitFor(() => expect(screen.queryByRole('progressbar', {name: 'loading piece'})).not.toBeInTheDocument());
    expect(screen.getByText(aicArtResponse.data.artist_display)).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(aicArtResponse.data.title);
  });

  test("shows the piece's title and artist once the museum answers", async () => {
    setupAICArtPieceResponse(aicArtResponse, aicArtResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${aicArtResponse.data.id}?tab=${Source.AIC}`}/>);

    expect(await screen.findByText(aicArtResponse.data.artist_display)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByAltText('Load Error')).not.toBeInTheDocument());
  });

  test('shows nothing but an error and says the museum is having trouble', async () => {
    anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);
    render(<TestApp at={`${Paths.artGallery}1234?tab=${Source.AIC}`}/>);

    expect(await screen.findByAltText('Load Error')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading piece'})).not.toBeInTheDocument();
    expect(within(screen.getByRole('alert', {hidden: true}))
      .getByText('the museum is having trouble')).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('A piece');
  });
});
