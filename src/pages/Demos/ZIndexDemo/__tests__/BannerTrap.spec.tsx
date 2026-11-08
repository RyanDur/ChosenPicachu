import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TestApp} from '@__test_support/TestApp';
import {demosAt} from '@pages/Demos/__test_support';
import {recipeFolds} from '@pages/Demos/Recipe/__test_support';
import {controlsBeforeTheSteps, wayLabelled} from '@pages/Demos/ZIndexDemo/__test_support';

const oldBanner = /^An old banner\./;

describe('the banner exhibit', () => {
  test('should give its steps before any control', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const banners = await screen.findByRole('figure', {name: /^The banners\./});

    const [steps] = within(banners).getAllByRole('list');

    expect(controlsBeforeTheSteps(steps, within(banners).getAllByRole('button'))).toEqual([]);
  });

  test('should show Raise a banner on both buttons, under the way each is built', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const banners = await screen.findByRole('figure', {name: /^The banners\./});

    const oldWay = within(banners).getByRole('button', {name: 'Raise a banner, the old way'});
    const sites = within(banners).getByRole('button', {name: 'Raise a banner, the site’s own'});

    expect(wayLabelled(banners, 'The old way')).toContainElement(oldWay);
    expect(wayLabelled(banners, 'The old way')).not.toContainElement(sites);
    expect(wayLabelled(banners, 'The site’s banner')).toContainElement(sites);
    expect(oldWay).toHaveTextContent(/^Raise a banner$/);
    expect(sites).toHaveTextContent(/^Raise a banner$/);
  });
});

describe('the old banner', () => {
  test('should say nothing until it is raised', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await screen.findByRole('button', {name: 'Raise a banner, the old way'});

    expect(screen.queryByText(oldBanner)).not.toBeInTheDocument();
  });

  test('should be announced when raised from card one', async () => {
    render(<TestApp at={demosAt('z-index')}/>);

    await userEvent.click(await screen.findByRole('button', {name: 'Raise a banner, the old way'}));

    expect(screen.getByText(oldBanner)).toHaveRole('alert');
  });

  test('should leave when dismissed by keyboard, and give focus back to the button that raised it', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
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
  test('should open the banner tutorial at the step that writes the panel at the page’s root, keeping the reader’s choices', async () => {
    render(<TestApp at={demosAt('z-index', '?raised=second')}/>);
    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    await userEvent.click(within(part).getByRole('link', {name: 'the tutorial below'}));

    expect(screen.getByText('Write the panel last, at the page’s root')).toBeVisible();
    expect(screen.getByRole('status', {name: 'url search'})).toHaveTextContent('raised=second');
  });

  test('should take the keyboard to the story the tutorial below names', async () => {
    render(<TestApp at={demosAt('z-index')}/>);
    const part = await screen.findByRole('region', {name: 'Why a fixed banner still loses'});

    await userEvent.click(within(part).getByRole('link', {name: 'the tutorial below'}));

    const story = recipeFolds.story(document.body, 'The user sees the news above everything');
    await waitFor(() => expect(recipeFolds.itemOf(story)).toHaveFocus());
  });
});
