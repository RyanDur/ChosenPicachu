import {TestApp} from '@__test_support/TestApp';
import {GalleryProviders} from '@pages/Gallery/Providers';
import {anyRequestFailsToConnect} from '@__test_support/server';
import {server} from '@__test_support/server';
import {env} from '@env';
import {render, waitFor} from '@testing-library/react';
import {ArtGallery} from '@pages/Gallery/Art';
import {Source} from '@pages/Gallery/museums/source';
import {aicArtResponse} from '@pages/Gallery/__test_support/fixtures';
import {test} from 'vitest';
import {Paths} from '@pages/Paths';
import {site} from '@pages/__test_support';
import {heldAICAllArtResponse, setupAICAllArtResponse, galleryWall} from '@pages/Gallery/__test_support';

describe('The gallery.', () => {
  test('loads the wall exactly once on mount', async () => {
    let hits = 0;
    const count = ({request}: {request: Request}) => {
      if (request.url.startsWith(`${env.aicDomain}/search`)) hits++;
    };
    server.events.on('response:mocked', count);
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await galleryWall.framesAppear();
    server.events.removeListener('response:mocked', count);

    expect(hits).toEqual(1);
  });

  test('only the first rows race for the wire; the rest wait below the fold', async () => {
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    const pictures = await galleryWall.pictures();
    expect(pictures.length).toBeGreaterThan(6);
    pictures.slice(0, 6).forEach(img => expect(img).not.toHaveAttribute('loading', 'lazy'));
    pictures.slice(6).forEach(img => expect(img).toHaveAttribute('loading', 'lazy'));
  });

  test('only the first piece is asked for at high priority', async () => {
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    const pictures = await galleryWall.pictures();
    expect(pictures[0]).toHaveAttribute('fetchpriority', 'high');
    pictures.slice(1).forEach(img => expect(img).not.toHaveAttribute('fetchpriority', 'high'));
  });

  test('the loading sign stands until the art arrives, and no frame before it', async () => {
    const artArrives = heldAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await galleryWall.loadingSignAppears();
    expect(galleryWall.frames()).toEqual([]);

    artArrives();

    await waitFor(() => expect(galleryWall.loadingSign()).not.toBeInTheDocument());
  });

  test('a museum with nothing to show leaves the wall empty', async () => {
    setupAICAllArtResponse({...aicArtResponse, data: []}, {page: 0, search: 'g', limit: 8});
    render(<TestApp at={`${Paths.artGallery}?page=0&search=g&size=8&tab=${Source.AIC}`}><GalleryProviders gallery={Paths.artGallery}><ArtGallery/></GalleryProviders></TestApp>);

    expect(await galleryWall.standIn('the museum answered with nothing')).toBeInTheDocument();
    expect(galleryWall.frames()).toEqual([]);
    expect(galleryWall.loadingSign()).not.toBeInTheDocument();
  });

  test('a museum that cannot be reached leaves the wall empty, and says so', async () => {
    anyRequestFailsToConnect();

    render(<TestApp at={`${Paths.artGallery}?page=23&search=g&size=8&tab=${Source.HARVARD}`}><GalleryProviders gallery={Paths.artGallery}><ArtGallery/></GalleryProviders></TestApp>);

    expect(await galleryWall.standIn('the museum refused to answer')).toBeInTheDocument();
    expect(galleryWall.frames()).toEqual([]);
    expect(galleryWall.loadingSign()).not.toBeInTheDocument();
    expect(site.announced('the museum could not be reached')).toBeInTheDocument();
  });
});
