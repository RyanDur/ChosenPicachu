import {TestApp} from '@__test_support/TestApp';
import {anyRequestRespondsWith} from '@__test_support/server';
import {render, screen, waitFor, within} from '@testing-library/react';
import {HTTPError} from '@transport/types';
import {Paths} from '@pages/Paths';
import {Source} from '@components/art-gallery/museums/source';
import {heldAICArtPieceResponse, setupAICArtPieceResponse} from '@components/art-gallery/__test_support';
import {anAICPieceResponse} from '@components/art-gallery/__test_support/fixtures';

describe('viewing a piece', () => {
  const pieceResponse = anAICPieceResponse();

  test('shows a loading sign and a placeholder title until the piece arrives', async () => {
    const pieceArrives = heldAICArtPieceResponse(pieceResponse, pieceResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${pieceResponse.data.id}?tab=${Source.AIC}`}/>);

    expect(await screen.findByRole('progressbar', {name: 'loading piece'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('A piece');

    pieceArrives();

    await waitFor(() => expect(screen.queryByRole('progressbar', {name: 'loading piece'})).not.toBeInTheDocument());
    expect(screen.getByText(pieceResponse.data.artist_display)).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(pieceResponse.data.title);
  });

  test("shows the piece's title and artist once the museum answers", async () => {
    setupAICArtPieceResponse(pieceResponse, pieceResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${pieceResponse.data.id}?tab=${Source.AIC}`}/>);

    expect(await screen.findByText(pieceResponse.data.artist_display)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByAltText('the museum refused to answer')).not.toBeInTheDocument());
  });

  test('shows nothing but an error and says the museum is having trouble', async () => {
    anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);
    render(<TestApp at={`${Paths.artGallery}1234?tab=${Source.AIC}`}/>);

    expect(await screen.findByAltText('the museum refused to answer')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading piece'})).not.toBeInTheDocument();
    expect(within(screen.getByRole('alert', {hidden: true}))
      .getByText('the museum is having trouble')).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('A piece');
  });
});
