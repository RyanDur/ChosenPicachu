import {TestApp} from '@__test_support/TestApp';
import {anyRequestFailsToConnect} from '@__test_support/server';
import {server} from '@__test_support/server';
import {env} from '@env';
import {render, screen, waitFor, within} from '@testing-library/react';
import {ArtGallery} from '@components/art-gallery';
import {Source} from '@components/art-gallery/museums/source';
import {aicArtResponse} from '@components/art-gallery/__test_support/fixtures';
import {test} from 'vitest';
import {Paths} from '@pages/Paths';
import {heldAICAllArtResponse, setupAICAllArtResponse, galleryWall} from '@components/art-gallery/__test_support';

describe('The gallery.', () => {
  test('loads the wall exactly once on mount', async () => {
    let hits = 0;
    const count = ({request}: {request: Request}) => {
      if (request.url.startsWith(`${env.aicDomain}/search`)) hits++;
    };
    server.events.on('response:mocked', count);
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await galleryWall.hangs();
    server.events.removeListener('response:mocked', count);

    expect(hits).toEqual(1);
  });

  test('only the first rows race for the wire; the rest wait below the fold', async () => {
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    const figures = await galleryWall.hangs();
    const walls = figures.map(figure => within(figure).getByRole('img'));
    expect(walls.length).toBeGreaterThan(6);
    walls.slice(0, 6).forEach(img => expect(img).not.toHaveAttribute('loading', 'lazy'));
    walls.slice(6).forEach(img => expect(img).toHaveAttribute('loading', 'lazy'));
  });

  test('the loading sign stands until the art arrives, and no frame before it', async () => {
    const artArrives = heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await screen.findByRole('progressbar', {name: 'loading gallery'});
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();

    artArrives();

    await waitFor(() => expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument());
  });

  test('a museum with nothing to show leaves the wall empty', async () => {
    setupAICAllArtResponse({...aicArtResponse, data: []}, {page: 0, search: 'g', limit: 8});
    render(<TestApp at={`${Paths.artGallery}?page=0&search=g&size=8&tab=${Source.AIC}`}><ArtGallery/></TestApp>);

    expect(await screen.findByAltText('the museum answered with nothing')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
  });

  test('a museum that cannot be reached leaves the wall empty, and says so', async () => {
    anyRequestFailsToConnect();

    render(<TestApp at={`${Paths.artGallery}?page=23&search=g&size=8&tab=${Source.HARVARD}`}><ArtGallery/></TestApp>);

    expect(await screen.findByAltText('the museum refused to answer')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(within(screen.getByRole('alert', {hidden: true}))
      .getByText('the museum could not be reached')).toBeInTheDocument();
  });
});
