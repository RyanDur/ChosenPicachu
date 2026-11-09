import {render, waitFor} from '@testing-library/react';
import {TestApp} from '@__test_support/TestApp';
import {renderCrashedFrame} from '@__test_support/crashedFrame';
import {chartPageAt, demosAt, demoTabs} from '@pages/Demos/__test_support';
import {chartPage} from '@pages/Demos/Charts/__test_support';
import {Route} from 'react-router';
import {Paths} from '@navigation';
import names from '@navigation/names.json';
import {recordPage} from '@pages/Record/__test_support/record';
import {practiceAt} from '@pages/Practice/__test_support/practice';
import {aicArtResponse, anAICPieceResponse} from '@pages/Gallery/__test_support/fixtures';
import {galleryWall, heldAICArtPieceResponse, setupAICAllArtResponse, setupAICArtPieceResponse} from '@pages/Gallery/__test_support';

const described = (): string | null => document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;

describe('each page is named where a search shows it', () => {
  test('should describe the record by as many moments as its timeline holds', async () => {
    render(<TestApp at={Paths.record}/>);

    expect(described()).toContain(`in ${await recordPage.momentsTold()} moments`);
  });

  test('should give the home page its own title and description', async () => {
    render(<TestApp at={Paths.home}/>);

    await waitFor(() => expect(document.title).toBe(names.home.title));
    expect(described()).toBe(names.home.description);
  });

  test('should give the accordions tab its own title and description', async () => {
    render(<TestApp at={demosAt('accordions')}/>);

    await waitFor(() => expect(document.title).toBe(names.demos.accordions.title));
    expect(described()).toBe(names.demos.accordions.description);
  });

  test('should give the z-index tab its own title and description', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await waitFor(() => expect(document.title).toBe(names.demos['z-index'].title));
    expect(described()).toBe(names.demos['z-index'].description);
  });

  test('should give the drag sort tab its own title and description', async () => {
    render(<TestApp at={demosAt('drag-and-drop')}/>);

    await waitFor(() => expect(document.title).toBe(names.demos['drag-and-drop'].title));
    expect(described()).toBe(names.demos['drag-and-drop'].description);
  });

  test('should give the charts tab its own title and description', async () => {
    render(<TestApp at={demosAt('charts')}/>);

    await waitFor(() => expect(document.title).toBe(names.demos.charts.title));
    expect(described()).toBe(names.demos.charts.description);
  });

  test('should give the tables tab its own title and description', async () => {
    render(<TestApp at={demosAt('tables')}/>);

    await waitFor(() => expect(document.title).toBe(names.demos.tables.title));
    expect(described()).toBe(names.demos.tables.description);
  });

  test('should give the drag sort tutorial its own title and description', async () => {
    render(<TestApp at={demosAt('tables/sort')}/>);

    await waitFor(() => expect(document.title).toBe(names.tables.sort.title));
    expect(described()).toBe(names.tables.sort.description);
  });

  test('should give the sort menu tutorial its own title and description', async () => {
    render(<TestApp at={demosAt('tables/menu')}/>);

    await waitFor(() => expect(document.title).toBe(names.tables.menu.title));
    expect(described()).toBe(names.tables.menu.description);
  });

  test('should give the drag resize tutorial its own title and description', async () => {
    render(<TestApp at={demosAt('tables/resize')}/>);

    await waitFor(() => expect(document.title).toBe(names.tables.resize.title));
    expect(described()).toBe(names.tables.resize.description);
  });

  test('should give the price line’s page its own title and description', async () => {
    render(<TestApp at={chartPageAt('price')}/>);

    await waitFor(() => expect(document.title).toBe(names.charts.price.title));
    expect(described()).toBe(names.charts.price.description);
  });

  test('should give the pie’s page its own title and description', async () => {
    render(<TestApp at={chartPageAt('pie')}/>);

    await waitFor(() => expect(document.title).toBe(names.charts.pie.title));
    expect(described()).toBe(names.charts.pie.description);
  });

  test('should give the users page its own title and description', async () => {
    render(<TestApp at={Paths.users}/>);

    await waitFor(() => expect(document.title).toBe(names.users.title));
    expect(described()).toBe(names.users.description);
  });

  test('should give the gallery its own title and description', async () => {
    render(<TestApp at={`${Paths.artGallery}?page=1&size=8&tab=aic`}/>);

    await waitFor(() => expect(document.title).toBe(names.gallery.title));
    expect(described()).toBe(names.gallery.description);
  });

  test('should give the games page its own title and description', async () => {
    render(<TestApp at={Paths.games}/>);

    await waitFor(() => expect(document.title).toBe(names.games.title));
    expect(described()).toBe(names.games.description);
  });

  test('should give the record its own title', async () => {
    render(<TestApp at={Paths.record}/>);

    await waitFor(() => expect(document.title).toBe(names.record.title));
  });

  test('should give the practice page Structure’s title and description when no tab is named', async () => {
    render(<TestApp at={Paths.practice}/>);

    await waitFor(() => expect(document.title).toBe(names.practice.structure.title));
    expect(described()).toBe(names.practice.structure.description);
  });

  test('should give practice’s structure tab its own title and description', async () => {
    render(<TestApp at={practiceAt('structure')}/>);

    await waitFor(() => expect(document.title).toBe(names.practice.structure.title));
    expect(described()).toBe(names.practice.structure.description);
  });

  test('should give practice’s presentation tab its own title and description', async () => {
    render(<TestApp at={practiceAt('presentation')}/>);

    await waitFor(() => expect(document.title).toBe(names.practice.presentation.title));
    expect(described()).toBe(names.practice.presentation.description);
  });

  test('should give practice’s behavior tab its own title and description', async () => {
    render(<TestApp at={practiceAt('behavior')}/>);

    await waitFor(() => expect(document.title).toBe(names.practice.behavior.title));
    expect(described()).toBe(names.practice.behavior.description);
  });

  test('should give an address with no room its own title and description', async () => {
    render(<TestApp at="/nowhere/"/>);

    await waitFor(() => expect(document.title).toBe(names.noRoom.title));
    expect(described()).toBe(names.noRoom.description);
  });

  test('should name the closed room for what it is when a page breaks', async () => {
    const Broken = () => {
      throw new Error('broken');
    };

    render(<TestApp><Route path="/" element={<Broken/>}/></TestApp>, {onCaughtError: () => undefined});

    await waitFor(() => expect(document.title).toBe(names.closedRoom.title));
    expect(described()).toBe(names.closedRoom.description);
  });

  test('should name the closed site for what it is when the frame around every page breaks', async () => {
    renderCrashedFrame();

    await waitFor(() => expect(document.title).toBe(names.closedSite.title));
    expect(described()).toBe(names.closedSite.description);
  });

  test('should give a room still loading the site’s own title and description', async () => {
    render(<TestApp><Route path="/" lazy={() => new Promise(() => undefined)}/></TestApp>);

    await waitFor(() => expect(document.title).toBe(names.home.title));
    expect(described()).toBe(names.home.description);
  });

  describe('an artwork’s page', () => {
    const piece = aicArtResponse.data[0];

    test('should carry the artwork’s title and its artist', async () => {
      setupAICAllArtResponse(aicArtResponse);
      setupAICArtPieceResponse(anAICPieceResponse(piece), piece.id);
      render(<TestApp at={Paths.artGallery}/>);

      await galleryWall.openPiece(piece.title);

      await waitFor(() => expect(document.title).toBe(`${piece.title} · Gallery · Chosen Picachu`));
      expect(described()).toBe(`${piece.title}, by ${piece.artist_display}, from the gallery’s wall.`);
    });

    test('should leave the artist out when the museum names none', async () => {
      setupAICAllArtResponse(aicArtResponse);
      setupAICArtPieceResponse(anAICPieceResponse({...piece, artist_display: ''}), piece.id);
      render(<TestApp at={Paths.artGallery}/>);

      await galleryWall.openPiece(piece.title);

      await waitFor(() => expect(document.title).toBe(`${piece.title} · Gallery · Chosen Picachu`));
      expect(described()).toBe(`${piece.title}, from the gallery’s wall.`);
    });

    test('should carry the gallery’s words until the museum answers', async () => {
      setupAICAllArtResponse(aicArtResponse);
      const answer = heldAICArtPieceResponse(anAICPieceResponse(piece), piece.id);
      render(<TestApp at={Paths.artGallery}/>);

      await galleryWall.openPiece(piece.title);

      await galleryWall.pieceStillComing();
      expect(document.title).toBe(names.gallery.title);
      expect(described()).toBe(names.gallery.description);
      answer();
      await waitFor(() => expect(document.title).toBe(`${piece.title} · Gallery · Chosen Picachu`));
    });
  });

  test('should carry the new tab’s title and description when the reader moves to it', async () => {
    render(<TestApp at={demosAt('accordions')}/>);
    await waitFor(() => expect(document.title).toBe(names.demos.accordions.title));

    await demoTabs.open('Z-index');

    await waitFor(() => expect(document.title).toBe(names.demos['z-index'].title));
    expect(described()).toBe(names.demos['z-index'].description);
  });

  test('should describe the price chart’s page with the story its tutorial tells', async () => {
    render(<TestApp at={chartPageAt('price', '?graph=price')}/>);

    expect(await chartPage.storyHeading(names.charts.price.description)).toBeInTheDocument();
    await waitFor(() => expect(described()).toBe(names.charts.price.description));
  });

  test('should describe the candles chart’s page with the story its tutorial tells', async () => {
    render(<TestApp at={chartPageAt('candles', '?graph=candles')}/>);

    expect(await chartPage.storyHeading(names.charts.candles.description)).toBeInTheDocument();
    await waitFor(() => expect(described()).toBe(names.charts.candles.description));
  });

  test('should describe the pressure chart’s page with the story its tutorial tells', async () => {
    render(<TestApp at={chartPageAt('pressure', '?graph=pressure')}/>);

    expect(await chartPage.storyHeading(names.charts.pressure.description)).toBeInTheDocument();
    await waitFor(() => expect(described()).toBe(names.charts.pressure.description));
  });

  test('should describe the pie chart’s page with the story its tutorial tells', async () => {
    render(<TestApp at={chartPageAt('pie', '?graph=pie')}/>);

    expect(await chartPage.storyHeading(names.charts.pie.description)).toBeInTheDocument();
    await waitFor(() => expect(described()).toBe(names.charts.pie.description));
  });
});
