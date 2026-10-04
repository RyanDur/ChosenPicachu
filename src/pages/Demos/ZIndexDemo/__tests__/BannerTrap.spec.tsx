import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {explanation} from '@pages/Demos/Recipe/__test_support';
import {controlsBeforeTheSteps} from '@pages/Demos/ZIndexDemo/__test_support';

const oldBanner = /^An old banner\./;

describe('the banner exhibit', () => {
  test('should give its steps before any control', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const banners = await screen.findByRole('figure', {name: /^The banners\./});

    const [steps] = within(banners).getAllByRole('list');

    expect(within(steps).getAllByRole('listitem').map(step => step.textContent)).toEqual([
      'Press Raise a banner, built the old way.',
      'Scroll until card two reaches the bottom of the window, and watch it pass over the banner.',
      'Press Raise a banner, in the top layer, and scroll again.'
    ]);
    expect(controlsBeforeTheSteps(steps, within(banners).getAllByRole('button'))).toEqual([]);
  });

  test('should tell each card’s z-index, and the old banner’s place, in a sentence', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const banners = await screen.findByRole('figure', {name: /^The banners\./});

    await userEvent.click(within(banners).getByRole('button', {name: 'Raise a banner, the old way'}));

    expect(within(banners).getByText('Card one has z-index: 1.')).toBeInTheDocument();
    expect(within(banners).getByText('Card two has z-index: 1, and comes later in the code.')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/^An old banner\. It is fixed to the window, with z-index: 9999\.×$/);
    expect(within(banners).queryByRole('code')).not.toBeInTheDocument();
  });

  test('should show Raise a banner on both buttons, under the way each is built', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    const banners = await screen.findByRole('figure', {name: /^The banners\./});

    const way = (label: string): HTMLElement | undefined => within(banners).getAllByRole('listitem')
      .filter(item => within(item).queryByText(label, {exact: true}) !== null).pop();
    const oldWay = within(banners).getByRole('button', {name: 'Raise a banner, the old way'});
    const topLayer = within(banners).getByRole('button', {name: 'Raise a banner, in the top layer'});

    expect(way('The old way')).toContainElement(oldWay);
    expect(way('The old way')).not.toContainElement(topLayer);
    expect(way('The top layer')).toContainElement(topLayer);
    expect(oldWay).toHaveTextContent(/^Raise a banner$/);
    expect(topLayer).toHaveTextContent(/^Raise a banner$/);
  });
});

describe('the old banner', () => {
  test('should say nothing until it is raised', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    await screen.findByRole('button', {name: 'Raise a banner, the old way'});

    expect(screen.queryByText(oldBanner)).not.toBeInTheDocument();
  });

  test('should be announced when raised from card one', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    await userEvent.click(await screen.findByRole('button', {name: 'Raise a banner, the old way'}));

    expect(screen.getByText(oldBanner)).toHaveRole('alert');
  });

  test('should leave when dismissed by keyboard, and give focus back to the button that raised it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);
    (await screen.findByRole('button', {name: 'Raise a banner, the old way'})).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.tab();
    await userEvent.tab();
    expect(screen.getByRole('button', {name: 'dismiss the old banner'})).toHaveFocus();

    await userEvent.keyboard('{Enter}');

    expect(screen.queryByText(oldBanner)).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Raise a banner, the old way'})).toHaveFocus();
  });
});

describe('why a fixed banner still loses', () => {
  test('should show the old banner’s rule and card one’s context beside the run that explains it', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    expect(explanation.everyCodeBeside(part, /The old banner’s position is fixed/).join())
      .toMatch(/\.old-banner \{[^]*position: fixed[^]*z-index: 9999[^]*\.forms-context \{[^]*z-index: 1/);
  });

  test('should show the site’s banner markup beside the run about the banner in the top layer', async () => {
    render(<TestApp at={demosAt('?tab=z-index')}/>);

    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    expect(explanation.everyCodeBeside(part, /The banner in the top layer is the site’s own banner/).join()).toMatch(/popover="manual"[^]*role="alert"/);
  });

  test('should open the banner tutorial at the step that makes it a popover, keeping the reader’s choices', async () => {
    render(<TestApp at={demosAt('?tab=z-index&raised=second')}/>);
    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    await userEvent.click(within(part).getByRole('link', {name: 'the tutorial below'}));

    expect(screen.getByText('Claim the top layer')).toBeVisible();
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('raised=second');
  });
});
