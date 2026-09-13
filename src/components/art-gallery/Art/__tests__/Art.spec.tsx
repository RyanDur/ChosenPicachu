import {TestApp} from '@test-support/TestApp';
import {anyRequestFailsToConnect} from '@test-support/server';
import {server} from '@test-support/server';
import {env} from '@env';
import {render, screen, waitFor, within} from '@testing-library/react';
import {ArtGallery} from '@components/art-gallery';
import {Source} from '@components/art-gallery/museums/types/resource';
import {aicArtResponse} from '@test-support/fixtures';
import {test} from 'vitest';
import {Paths} from '@pages/Paths';
import {setupAICAllArtResponse, slowAICAllArtResponse} from '@components/art-gallery/__tests__/galleryApiTestHelper';

describe('The gallery.', () => {
  test('loads the wall exactly once on mount', async () => {
    let hits = 0;
    const count = ({request}: {request: Request}) => {
      if (request.url.startsWith(`${env.aicDomain}/search`)) hits++;
    };
    server.events.on('response:mocked', count);
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await screen.findAllByRole('figure');
    server.events.removeListener('response:mocked', count);

    expect(hits).toEqual(1);
  });

  test('only the first rows race for the wire; the rest wait below the fold', async () => {
    setupAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    const figures = await screen.findAllByRole('figure');
    const walls = figures.map(figure => within(figure).getByRole('img'));
    expect(walls.length).toBeGreaterThan(6);
    walls.slice(0, 6).forEach(img => expect(img).not.toHaveAttribute('loading', 'lazy'));
    walls.slice(6).forEach(img => expect(img).toHaveAttribute('loading', 'lazy'));
  });

  test('when the art is loading', async () => {
    slowAICAllArtResponse(aicArtResponse);
    render(<TestApp at={Paths.artGallery}/>);

    await screen.findByRole('progressbar', {name: 'loading gallery'});
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument());
  });

  test('when there is no art to show', async () => {
    setupAICAllArtResponse({...aicArtResponse, data: []}, {page: 0, search: 'g', limit: 8});
    render(<TestApp at={`${Paths.artGallery}?page=0&search=g&size=8&tab=${Source.AIC}`}><ArtGallery/></TestApp>);

    expect(await screen.findByAltText('empty gallery')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
  });

  test('when the art has errored', async () => {
    anyRequestFailsToConnect();

    render(<TestApp at={`${Paths.artGallery}?page=23&search=g&size=8&tab=${Source.HARVARD}`}><ArtGallery/></TestApp>);

    expect(await screen.findByAltText('empty gallery')).toBeInTheDocument();
    expect(screen.queryByRole('figure')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar', {name: 'loading gallery'})).not.toBeInTheDocument();
    expect(within(screen.getByRole('alert', {hidden: true}))
      .getByText('the museum could not be reached')).toBeInTheDocument();
  });
});
