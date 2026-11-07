import {TestApp} from '@__test_support/TestApp';
import {anyRequestRespondsWith} from '@__test_support/server';
import {render, waitFor} from '@testing-library/react';
import {HTTPError} from '@transport/types';
import {Paths} from '@pages/Paths';
import {Source} from '@pages/Gallery/museums/source';
import {heldAICArtPieceResponse, setupAICArtPieceResponse} from '@pages/Gallery/__test_support';
import {anAICPieceResponse, harvardPiece, harvardPieceResponse} from '@pages/Gallery/__test_support/fixtures';
import {piecePage} from '@pages/Gallery/ArtPiece/__test_support';

describe('viewing a piece', () => {
  const pieceResponse = anAICPieceResponse();

  test('shows a loading sign and a placeholder title until the piece arrives', async () => {
    const pieceArrives = heldAICArtPieceResponse(pieceResponse, pieceResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${pieceResponse.data.id}?tab=${Source.AIC}`}/>);

    expect(await piecePage.loadingAppears()).toBeInTheDocument();
    expect(piecePage.title()).toHaveTextContent('A piece');

    pieceArrives();

    await waitFor(() => expect(piecePage.loadingIfAny()).not.toBeInTheDocument());
    expect(piecePage.artist(pieceResponse.data.artist_display)).toBeInTheDocument();
    expect(piecePage.title()).toHaveTextContent(pieceResponse.data.title);
  });

  test("shows the piece's title and artist once the museum answers", async () => {
    setupAICArtPieceResponse(pieceResponse, pieceResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${pieceResponse.data.id}?tab=${Source.AIC}`}/>);

    expect(await piecePage.artistAppears(pieceResponse.data.artist_display)).toBeInTheDocument();
    await waitFor(() => expect(piecePage.refusalIfAny()).not.toBeInTheDocument());
  });

  test('a piece opened with no museum in its address is shown from the Art Institute', async () => {
    setupAICArtPieceResponse(pieceResponse, pieceResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${pieceResponse.data.id}`}/>);

    expect(await piecePage.artistAppears(pieceResponse.data.artist_display)).toBeInTheDocument();
  });

  test('says the artist is unknown when the museum names none', async () => {
    anyRequestRespondsWith(JSON.stringify({...harvardPieceResponse, people: []}));

    render(<TestApp at={`${Paths.artGallery}${harvardPiece.id}?tab=${Source.HARVARD}`}/>);

    expect(await piecePage.artistAppears('Unknown')).toBeInTheDocument();
  });

  test('shows nothing but an error and says the museum is having trouble', async () => {
    anyRequestRespondsWith(HTTPError.SERVER_ERROR, 500);
    render(<TestApp at={`${Paths.artGallery}1234?tab=${Source.AIC}`}/>);

    expect(await piecePage.refusalAppears()).toBeInTheDocument();
    expect(piecePage.easelIfAny()).not.toBeInTheDocument();
    expect(piecePage.loadingIfAny()).not.toBeInTheDocument();
    expect(piecePage.troubleSaid('the museum is having trouble')).toBeInTheDocument();
    expect(piecePage.title()).toHaveTextContent('A piece');
  });
});
