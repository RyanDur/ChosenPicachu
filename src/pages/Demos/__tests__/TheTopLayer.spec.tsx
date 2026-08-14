import {fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {seed} from '@ngneat/falso';
import {renderWithMemoryRouter} from '@test-support';
import {Paths} from '@pages/Paths';
import {Demos} from '@pages/Demos';

beforeEach(() => seed('top-layer'));

const troublesIn = (alert: HTMLElement): HTMLElement[] =>
  within(alert).queryAllByRole('button', {name: /^dismiss /, hidden: true});

const openZIndexTab = async () => {
  renderWithMemoryRouter(Demos, {path: Paths.demos});
  const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
  await userEvent.click(within(demoTabs).getByText('Z-Index'));
};

describe('the top layer', () => {
  test('the user raises a banner from the demo, and dismisses it', async () => {
    await openZIndexTab();
    const alert = screen.getByRole('alert', {hidden: true});
    const alreadyStanding = troublesIn(alert).length;

    await userEvent.click(await screen.findByRole('button', {name: 'raise a banner'}));

    const raised = troublesIn(alert);
    expect(raised).toHaveLength(alreadyStanding + 1);
    const newest = raised[raised.length - 1];
    const item = newest.closest('li');
    if (!item) {
      throw new Error('the raised trouble stands in no list item');
    }
    await userEvent.click(newest);
    fireEvent.transitionEnd(item, {propertyName: 'grid-template-rows'});
    expect(troublesIn(alert)).toHaveLength(alreadyStanding);
  });

  test('every press stacks another banner', async () => {
    await openZIndexTab();
    const alert = screen.getByRole('alert', {hidden: true});
    const alreadyStanding = troublesIn(alert).length;
    const raise = await screen.findByRole('button', {name: 'raise a banner'});

    await userEvent.click(raise);
    await userEvent.click(raise);
    await userEvent.click(raise);

    expect(troublesIn(alert)).toHaveLength(alreadyStanding + 3);
  });

  test('the tutorial tells the story of the news', async () => {
    await openZIndexTab();

    expect(await screen.findByText('let’s build this feature')).toBeVisible();
    expect(screen.getByText('The user sees the news above everything')).toBeVisible();
    expect(screen.getByText('The user can have multiple banners')).toBeVisible();
    expect(screen.queryByText('Any component can raise a banner')).not.toBeInTheDocument();
    expect(screen.queryByText('The news travels, and the pile makes room')).not.toBeInTheDocument();
  });

  test('the dials move the panel, turn its entrance, and explain themselves', async () => {
    await openZIndexTab();
    const controls = await screen.findByRole('region', {name: 'banner controls'});

    await userEvent.click(within(within(controls).getByRole('group', {name: 'side'})).getByRole('radio', {name: 'Bottom'}));
    await userEvent.click(within(within(controls).getByRole('group', {name: 'align'})).getByRole('radio', {name: 'Right'}));
    await userEvent.click(within(within(controls).getByRole('group', {name: 'entrance'})).getByRole('radio', {name: 'Below'}));
    await userEvent.click(within(within(controls).getByRole('group', {name: 'stack'})).getByRole('radio', {name: 'Left'}));

    const alert = screen.getByRole('alert', {hidden: true});
    expect(alert).toHaveClass('bottom', 'right', 'from-below', 'stack-left');
    expect(within(controls).getByText('The news rests along the bottom edge and waits to be noticed.')).toBeVisible();
    expect(within(controls).getByText('?side=bottom&align=right&enter=below&stack=left')).toBeVisible();
  });

  test('every wrong-way snippet names itself', async () => {
    await openZIndexTab();

    await screen.findByText('let’s build this feature');
    expect(screen.getAllByText('the wrong way')).toHaveLength(5);
  });
});
