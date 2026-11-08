import {TestApp} from '@__test_support/TestApp';
import {anyRequestRespondsWith} from '@__test_support/server';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {HTTPError} from '@transport';
import {Paths} from '@navigation';
import {Source} from '@pages/Gallery/source';
import {heldAICArtPieceResponse, setupAICArtPieceResponse} from '@pages/Gallery/__test_support';
import {aicSuggestionsOf, anAICPieceResponse, harvardPiece, harvardPieceResponse} from '@pages/Gallery/__test_support/fixtures';
import {piecePage} from '@pages/Gallery/ArtPiece/__test_support';

describe('viewing a piece', () => {
  const pieceResponse = anAICPieceResponse();

  test('shows a loading sign and a placeholder title until the piece arrives', async () => {
    const pieceArrives = heldAICArtPieceResponse(pieceResponse, pieceResponse.data.id);

    render(<TestApp at={`${Paths.artGallery}${pieceResponse.data.id}?tab=${Source.AIC}`}/>);

    expect(await piecePage.loadingAppears()).toBeInTheDocument();
    expect(piecePage.title()).toHaveTextContent('A piece');

    pieceArrives.arrives();

    await waitFor(() => expect(piecePage.loadingIfAny()).not.toBeInTheDocument());
    expect(piecePage.artist(pieceResponse.data.artist_display)).toBeInTheDocument();
    expect(piecePage.title()).toHaveTextContent(pieceResponse.data.title);
  });

  test('keeps what the reader typed into the search, and the focus, when the piece arrives', async () => {
    anyRequestRespondsWith(JSON.stringify(aicSuggestionsOf([])));
    const piece = heldAICArtPieceResponse(pieceResponse, pieceResponse.data.id);
    render(<TestApp at={`${Paths.artGallery}${pieceResponse.data.id}?tab=${Source.AIC}`}/>);
    await piecePage.loadingAppears();

    await userEvent.type(piecePage.search(), 'water lilies');
    piece.arrives();

    expect(await piecePage.artistAppears(pieceResponse.data.artist_display)).toBeInTheDocument();
    expect(piecePage.search()).toHaveValue('water lilies');
    expect(piecePage.search()).toHaveFocus();
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
    expect(await piecePage.troubleSays('the museum is having trouble')).toBeInTheDocument();
    expect(piecePage.title()).toHaveTextContent('A piece');
  });
});
