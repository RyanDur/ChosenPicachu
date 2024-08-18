import {aicArtResponse} from '../../../__tests__/util/dummyData';
import {renderWithMemoryRouter} from '../../../__tests__/util';
import {screen, waitFor} from '@testing-library/react';
import {Paths} from '../../../routes/Paths';
import {Gallery} from '../index';
import userEvent from '@testing-library/user-event';
import {AICAllArt, AICArtResponse} from '../resource/aic/types';
import {test} from 'vitest';
import {aicDomain, defaultRecordLimit} from '../../../config';
import {fields} from '../resource/aic';

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

const setupAllArtResponse = (response: AICAllArt = aicArtResponse) =>
  fetchMock.mockResponseOnce((request) => {
    if (request.url === `${aicDomain}?fields=${fields.join()}&limit=${defaultRecordLimit}`) {
      return Promise.resolve(JSON.stringify(response));
    } else return Promise.reject('wrong url');
  });

const setupArtPieceResponse = (response: AICArtResponse = aicArtPieceResponse) =>
  fetchMock.mockResponseOnce((request) => {
    if (request.url === `${aicDomain}/${firstPiece.id}?fields=${fields.join()}&limit=${defaultRecordLimit}`) {
      return Promise.resolve(JSON.stringify(response));
    } else return Promise.reject('wrong url');
  });

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('When the art has loaded', async () => {
    setupAllArtResponse();
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(aicArtResponse.pagination.limit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });

  it('should allow a user to take a closer look at the art', async () => {
    setupAllArtResponse();
    setupArtPieceResponse();
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));

    expect(await screen.findByText(firstPiece.artist_display)).toBeInTheDocument();
    expect(screen.getByTestId('image-figure')).toBeInTheDocument();
  });
});
