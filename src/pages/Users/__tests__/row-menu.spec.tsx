import {TestApp} from '@test-support/TestApp';
import {render, screen, waitFor, within} from '@testing-library/react';
import {Paths} from '@pages/Paths';

describe('the row menu is a popover anchored to its toggle', () => {
  const firstRow = async () => {
    render(<TestApp at={Paths.users}/>);
    await waitFor(() => expect(screen.getAllByRole('row').length).toBeGreaterThan(1));
    return screen.getAllByRole('row')[1];
  };

  const menuFor = (toggle: HTMLElement): HTMLElement =>
    screen.getByLabelText(`${toggle.getAttribute('aria-label') ?? ''}, chosen`);

  test("each row's actions button has a menu of its own that opens as a popover", async () => {
    const row = await firstRow();
    const toggle = within(row).getByRole('button', {name: /^Actions for /});

    expect(menuFor(toggle).getAttribute('popover')).toBe('auto');
  });

  test('the menu offers every row action', async () => {
    const row = await firstRow();
    const toggle = within(row).getByRole('button', {name: /^Actions for /});

    ['View', 'Edit', 'Clone'].forEach(action =>
      expect(within(menuFor(toggle)).getByRole('link', {name: action, hidden: true})).toBeInTheDocument());
    expect(within(menuFor(toggle)).getByRole('button', {name: 'Remove', hidden: true})).toBeInTheDocument();
  });
});
