import {aicArtResponse} from '../../../__tests__/util/dummyData';
import {renderWithMemoryRouter} from '../../../__tests__/util';
import {screen, waitFor} from '@testing-library/react';
import {Paths} from '../../../routes/Paths';
import {Gallery} from '../index';
import userEvent from '@testing-library/user-event';
import {AICArtResponse} from '../resource/aic/types';
import {test} from 'vitest';
import {aicDomain, defaultRecordLimit} from '../../../config';
import {fields} from '../resource/aic';
import {AllArtResponse, ArtResponse} from '../resource/types/response';

const firstPiece = aicArtResponse.data[0];

const aicArtPieceResponse: AICArtResponse = {
  data: {
    id: firstPiece.id,
    title: firstPiece.title,
    term_titles: firstPiece.term_titles,
    artist_display: firstPiece.artist_display,
    image_id: firstPiece.image_id
  }
};

const setupAllArtResponse = (response: AllArtResponse, limit = defaultRecordLimit) =>
  fetchMock.mockOnceIf(`${aicDomain}?fields=${fields.join()}&limit=${limit}`,
    () => Promise.resolve(JSON.stringify(response)));

const setupArtPieceResponse = (response: ArtResponse) =>
  fetchMock.mockOnceIf(`${aicDomain}/${firstPiece.id}?fields=${fields.join()}&limit=${defaultRecordLimit}`,
    () => Promise.resolve(JSON.stringify(response)));

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('When the art has loaded', async () => {
    setupAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(aicArtResponse.pagination.limit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });

  it('should allow a user to take a closer look at the art', async () => {
    setupAllArtResponse(aicArtResponse);
    setupArtPieceResponse(aicArtPieceResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));

    expect(await screen.findByText(firstPiece.artist_display)).toBeInTheDocument();
    expect(screen.getByTestId('image-figure')).toBeInTheDocument();
  });
});
