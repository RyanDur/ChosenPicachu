import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {chartPageAt, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {Route} from 'react-router';
import {Paths} from '@pages/Paths';
import names from '@pages/names.json';
import {aicArtResponse, anAICPieceResponse, harvardPiece, harvardPieceResponse} from '@components/art-gallery/__test_support/fixtures';
import {anyRequestRespondsWith} from '@__test_support/server';
import {Source} from '@components/art-gallery/museums/source';
import {galleryWall, heldAICArtPieceResponse, setupAICAllArtResponse, setupAICArtPieceResponse} from '@components/art-gallery/__test_support';

const described = (): string | null => document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;

describe('each page is named where a search shows it', () => {
  test.each([
    ['the home page', Paths.home, names.home],
    ['the accordions tab', demosAt('?tab=accordions'), names.demos.accordions],
    ['the z-index tab', demosAt('?tab=z-index'), names.demos['z-index']],
    ['the drag sort tab', demosAt('?tab=dragAndDrop'), names.demos.dragAndDrop],
    ['the charts tab', demosAt('?tab=charts'), names.demos.charts],
    ['the tables tab', demosAt('?tab=tables'), names.demos.tables],
    ['the price line’s page', chartPageAt('price'), names.charts.price],
    ['the pie’s page', chartPageAt('pie'), names.charts.pie],
    ['the users page', Paths.users, names.users],
    ['the gallery', `${Paths.artGallery}?page=1&size=8&tab=aic`, names.gallery],
    ['the games page', Paths.games, names.games],
    ['an address with no room', '/nowhere/', names.noRoom]
  ])('should give %s its own title and description', async (_page, path, {title, description}) => {
    render(<TestApp at={path}/>);

    await waitFor(() => expect(document.title).toBe(title));
    expect(described()).toBe(description);
  });

  test('should name the closed room for what it is when a page breaks', async () => {
    const Broken = () => {
      throw new Error('broken');
    };

    render(<TestApp><Route path="/" element={<Broken/>}/></TestApp>, {onCaughtError: () => undefined});

    await waitFor(() => expect(document.title).toBe(names.closedRoom.title));
    expect(described()).toBe(names.closedRoom.description);
  });

  describe('an artwork’s page', () => {
    const piece = aicArtResponse.data[0];

    test('should carry the artwork’s title and its artist', async () => {
      setupAICAllArtResponse(aicArtResponse);
      setupAICArtPieceResponse(anAICPieceResponse(piece), piece.id);
      render(<TestApp at={Paths.artGallery}/>);

      await userEvent.click(within(await galleryWall.frameTitled(piece.title)).getByRole('img'));

      await waitFor(() => expect(document.title).toBe(`${piece.title} · Gallery · Chosen Picachu`));
      expect(described()).toBe(`${piece.title}, by ${piece.artist_display}, from the gallery’s wall.`);
    });

    test('should leave the artist out when the museum names none', async () => {
      setupAICAllArtResponse(aicArtResponse);
      setupAICArtPieceResponse(anAICPieceResponse({...piece, artist_display: ''}), piece.id);
      render(<TestApp at={Paths.artGallery}/>);

      await userEvent.click(within(await galleryWall.frameTitled(piece.title)).getByRole('img'));

      await waitFor(() => expect(document.title).toBe(`${piece.title} · Gallery · Chosen Picachu`));
      expect(described()).toBe(`${piece.title}, from the gallery’s wall.`);
    });

    test('should leave the artist out when a Harvard piece names no artist', async () => {
      anyRequestRespondsWith(JSON.stringify({...harvardPieceResponse, people: []}));

      render(<TestApp at={`${Paths.artGallery}${harvardPiece.id}?tab=${Source.HARVARD}`}/>);

      await waitFor(() => expect(document.title).toBe(`${harvardPiece.title} · Gallery · Chosen Picachu`));
      expect(described()).toBe(`${harvardPiece.title}, from the gallery’s wall.`);
    });

    test('should carry the gallery’s words until the museum answers', async () => {
      setupAICAllArtResponse(aicArtResponse);
      const answer = heldAICArtPieceResponse(anAICPieceResponse(piece), piece.id);
      render(<TestApp at={Paths.artGallery}/>);

      await userEvent.click(within(await galleryWall.frameTitled(piece.title)).getByRole('img'));

      await screen.findByRole('heading', {name: 'A piece'});
      expect(document.title).toBe(names.gallery.title);
      expect(described()).toBe(names.gallery.description);
      answer();
      await waitFor(() => expect(document.title).toBe(`${piece.title} · Gallery · Chosen Picachu`));
    });
  });

  test('should carry the new tab’s title and description when the reader moves to it', async () => {
    render(<TestApp at={demosAt('?tab=accordions')}/>);
    await waitFor(() => expect(document.title).toBe(names.demos.accordions.title));

    await demoTabs.open('Z-index');

    await waitFor(() => expect(document.title).toBe(names.demos['z-index'].title));
    expect(described()).toBe(names.demos['z-index'].description);
  });

  test.each(Object.entries(names.charts))('should describe the %s chart’s page with the story its tutorial tells', async (kind, {description}) => {
    render(<TestApp at={chartPageAt(kind, `?graph=${kind}`)}/>);

    expect(await screen.findByRole('heading', {name: description.replace(/\.$/, '')})).toBeInTheDocument();
    await waitFor(() => expect(described()).toBe(description));
  });
});
