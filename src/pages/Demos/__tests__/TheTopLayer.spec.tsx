import {fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithMemoryRouter} from '@test-support';
import {Paths} from '@pages/Paths';
import {Demos} from '@pages/Demos';

const standingIn = (alert: HTMLElement, message: string): HTMLElement => {
  const item = within(alert).getByText(message).closest('li');
  if (!item) {
    throw new Error(`no standing trouble says "${message}"`);
  }
  return item;
};

const openZIndexTab = async () => {
  renderWithMemoryRouter(Demos, {path: Paths.demos});
  const demoTabs = await screen.findByRole('navigation', {name: 'demos'});
  await userEvent.click(within(demoTabs).getByText('Z-Index'));
};

describe('the top layer', () => {
  test('the user raises a banner from the demo, and dismisses it', async () => {
    await openZIndexTab();

    await userEvent.click(await screen.findByRole('button', {name: 'raise a banner'}));

    const alert = screen.getByRole('alert', {hidden: true});
    expect(within(alert).getByText('banner 1 rides the top layer, above every z-index on the page'))
      .toBeInTheDocument();
    await userEvent.click(within(alert).getByRole('button',
      {name: 'dismiss banner 1 rides the top layer, above every z-index on the page', hidden: true}));
    fireEvent.transitionEnd(standingIn(alert, 'banner 1 rides the top layer, above every z-index on the page'),
      {propertyName: 'grid-template-rows'});
    expect(within(alert).queryByText('banner 1 rides the top layer, above every z-index on the page'))
      .not.toBeInTheDocument();
  });

  test('every press stacks another banner', async () => {
    await openZIndexTab();
    const raise = await screen.findByRole('button', {name: 'raise a banner'});

    await userEvent.click(raise);
    await userEvent.click(raise);
    await userEvent.click(raise);

    const alert = screen.getByRole('alert', {hidden: true});
    expect(within(alert).getAllByText(/rides the top layer/)).toHaveLength(3);
  });

  test('the tutorial tells the story of the news', async () => {
    await openZIndexTab();

    expect(await screen.findByText('let’s build this feature')).toBeVisible();
    expect(screen.getByText('The user sees trouble above everything')).toBeVisible();
    expect(screen.getByText('Any component can raise its trouble')).toBeVisible();
    expect(screen.getByText('The same trouble stands only once')).toBeVisible();
    expect(screen.getByText('The feeds raise their own news')).toBeVisible();
  });

  test('the dials move the panel and turn its entrance', async () => {
    await openZIndexTab();
    await screen.findByRole('button', {name: 'raise a banner'});

    await userEvent.click(within(screen.getByRole('group', {name: 'side'})).getByRole('radio', {name: 'Bottom'}));
    await userEvent.click(within(screen.getByRole('group', {name: 'align'})).getByRole('radio', {name: 'Right'}));
    await userEvent.click(within(screen.getByRole('group', {name: 'entrance'})).getByRole('radio', {name: 'Below'}));
    await userEvent.click(within(screen.getByRole('group', {name: 'stack'})).getByRole('radio', {name: 'Left'}));

    const alert = screen.getByRole('alert', {hidden: true});
    expect(alert).toHaveClass('bottom', 'right', 'from-below', 'stack-left');
  });

  test('every wrong-way snippet names itself', async () => {
    await openZIndexTab();

    await screen.findByText('let’s build this feature');
    expect(screen.getAllByText('the wrong way')).toHaveLength(4);
  });
});
