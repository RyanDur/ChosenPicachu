import {aicArtResponse, harvardArtResponse, rIJKArtResponse} from '../../../__tests__/util/dummyData';
import {renderWithMemoryRouter} from '../../../__tests__/util';
import {screen, waitFor} from '@testing-library/react';
import {Paths} from '../../../routes/Paths';
import {Gallery} from '../index';
import userEvent from '@testing-library/user-event';
import {AICAllArtResponse, AICArtResponse} from '../resource/aic/types';
import {test} from 'vitest';
import {aicDomain, defaultRecordLimit, harvardAPIKey, harvardDomain, rijksAPIKey, rijksDomain} from '../../../config';
import {fields} from '../resource/aic';
import {HarvardAllArtResponse} from '../resource/harvard/types';
import {harvardFields} from '../resource/harvard';
import {RIJKSAllArtResponse} from "../resource/rijks/types";

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

const setupAICAllArtResponse = (response: AICAllArtResponse, limit = defaultRecordLimit) =>
  fetchMock.mockOnceIf(`${aicDomain}/?fields=${fields.join()}&limit=${limit}`,
    () => Promise.resolve(JSON.stringify(response)));

const setupHarvardAllArtResponse = (response: HarvardAllArtResponse, limit = defaultRecordLimit) =>
  fetchMock.mockOnceIf(`${harvardDomain}/?page=1&size=${limit}&fields=${harvardFields}&apikey=${harvardAPIKey}`,
    () => Promise.resolve(JSON.stringify(response)));

const setupRijksAllArtResponse = (response: RIJKSAllArtResponse, limit = defaultRecordLimit) =>
    fetchMock.mockOnceIf(`${rijksDomain}/?p=1&ps=${limit}&imgonly=true&key=${rijksAPIKey}`,
        () => Promise.resolve(JSON.stringify(response)));

const setupAICArtPieceResponse = (response: AICArtResponse) =>
  fetchMock.mockOnceIf(`${aicDomain}/${firstPiece.id}?fields=${fields.join()}`,
    () => Promise.resolve(JSON.stringify(response)));

describe('The gallery.', () => {
  window.scrollTo = vi.fn();

  test('When the art has loaded', async () => {
    setupAICAllArtResponse(aicArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(defaultRecordLimit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });

  it('should allow a user to take a closer look at the art', async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupAICArtPieceResponse(aicArtPieceResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await userEvent.click(await screen.findByTestId(`piece-${firstPiece.id}`));

    expect(await screen.findByText(firstPiece.artist_display)).toBeInTheDocument();
    expect(screen.getByTestId('image-figure')).toBeInTheDocument();
  });

  test('when looking at the harvard gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupHarvardAllArtResponse(harvardArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await userEvent.click(await screen.findByText(`Harvard Art Museums`));

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(defaultRecordLimit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });

  test('when looking at the rijks gallery', async () => {
    setupAICAllArtResponse(aicArtResponse);
    setupRijksAllArtResponse(rIJKArtResponse);
    renderWithMemoryRouter(Gallery, {path: Paths.artGallery});

    await userEvent.click(await screen.findByText('Rijksstudio'));

    await waitFor(() => expect(screen.getAllByTestId(/piece/).length).toEqual(defaultRecordLimit));
    expect(screen.queryByTestId('gallery-loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-gallery')).not.toBeInTheDocument();
  });
});
