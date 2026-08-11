import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithMemoryRouter} from '@test-support';
import {Paths} from '@pages/Paths';
import {Demos} from '@pages/Demos';

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
    expect(within(alert).getByText('this banner rides the top layer, above every z-index on the page'))
      .toBeInTheDocument();
    await userEvent.click(within(alert).getByRole('button',
      {name: 'dismiss this banner rides the top layer, above every z-index on the page', hidden: true}));
    expect(within(alert).queryByText('this banner rides the top layer, above every z-index on the page'))
      .not.toBeInTheDocument();
  });

  test('the tutorial tells the story of the news', async () => {
    await openZIndexTab();

    expect(await screen.findByText('let’s build this feature')).toBeVisible();
    expect(screen.getByText('The user sees trouble above everything')).toBeVisible();
    expect(screen.getByText('Any component can raise its trouble')).toBeVisible();
    expect(screen.getByText('The same trouble stands only once')).toBeVisible();
    expect(screen.getByText('The feeds raise their own news')).toBeVisible();
  });
});
